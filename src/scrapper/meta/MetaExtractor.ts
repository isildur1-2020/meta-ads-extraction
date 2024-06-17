import {
  AdsArchiveItem,
  BUC_ITEM,
  MetaResponseHeaders,
  MetaScrapperConfig,
} from "../../lib/constants";
import { Logger } from "../../lib/logs";
import { MetaServices } from "../../services/MetaService";
import { appendFile } from "fs/promises";
import path from "path";
import { AxiosError } from "axios";
import { ENV } from "../../config/Env";
import { Ad } from "../../models/Ad";
import { MetaScrapper } from "./MetaScrapper";
import { getRandomNumber } from "../../lib/utils";

export class MetaExtractor {
  private counter = 0;
  private randomNumber: number = 0;
  private data_companies = new Map();
  private readonly ads_data_path = path.join(process.cwd(), "/src/output/");

  constructor(private config: MetaScrapperConfig) {}

  public async getAdsArchive() {
    try {
      await MetaScrapper.init();
      await this.tryGetAdsArchive();
    } catch (err: any) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data?.error);
      } else {
        console.log(err);
      }
    }
  }

  private async tryGetAdsArchive(config?: { after?: string }) {
    this.randomNumber = getRandomNumber(100, 250);
    const { ads, headers, paging } = await MetaServices.getAdsArchive({
      ...this.config,
      limit: this.randomNumber,
      after: config?.after,
    });
    this.counter += this.randomNumber;
    this.printProgress(headers as MetaResponseHeaders);
    await this.persistAdsArchiveData(ads);
    await this.checkRateLimits(headers as MetaResponseHeaders);
    if (paging?.next) {
      this.tryGetAdsArchive({ after: paging.cursors.after });
      this.counter++;
    }
  }

  private async checkRateLimits(headers: MetaResponseHeaders) {
    const { total_time, call_count } = this.getBUCInfo(headers);
    if (total_time > 90 || call_count > 90) {
      const minutesToSleep = 60 * 24;
      Logger.printErrMsg(`The app need sleep for ${minutesToSleep} minutes`);
      const intervalId = await this.scrapperToSleep(minutesToSleep);
      clearInterval(intervalId);
    }
  }

  private scrapperToSleep(minutes: number): Promise<NodeJS.Timeout> {
    let counter = 1;
    const intervalId = setInterval(() => {
      const waitTime = minutes * 60 - counter;
      Logger.printWarningMsg(`The app will start in ${waitTime} seconds...`);
      counter++;
    }, 1000);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(intervalId);
      }, minutes * 60 * 1000);
    });
  }

  private printProgress(headers: MetaResponseHeaders) {
    Logger.printWarningMsg("-------------------------------------");
    Logger.printWarningMsg(
      `-- LIMIT: ${this.randomNumber}, ADS EXTRACTED: ${this.counter} --`
    );
    Logger.printWarningMsg("-------------------------------------");
    this.printBUCStats(headers);
  }

  private printBUCStats(headers: MetaResponseHeaders) {
    const {
      total_time,
      call_count,
      total_cputime,
      estimated_time_to_regain_access,
    } = this.getBUCInfo(headers);
    Logger.printWarningMsg("-------------------------------------");
    Logger.printWarningMsg(`-- TOTAL PERCENTAGE: ${total_time}`);
    Logger.printWarningMsg(`-- CPU TIME: ${total_cputime}`);
    Logger.printWarningMsg(`-- CALL COUNT: ${call_count}`);
    Logger.printWarningMsg(
      `-- TIME TO WAIT: ${estimated_time_to_regain_access}`
    );
    Logger.printWarningMsg("-------------------------------------");
  }

  private getBUCInfo(headers: MetaResponseHeaders) {
    if (!ENV.SCRAPPER_ID) {
      throw new Error("SCRAPPER_ID must defined");
    }
    const limits = JSON.parse(headers["x-business-use-case-usage"]);
    return limits[ENV.SCRAPPER_ID][0] as BUC_ITEM;
  }

  private async persistAdsArchiveData(ads: AdsArchiveItem[]) {
    for (let ad of ads) {
      const { page_id, page_name } = ad;
      if (!this.data_companies.has(page_id)) {
        this.data_companies.set(page_id, page_name);
        this.persistAdsOnFile(ad);
        await this.persistAdsOnDB(ad);
      }
    }
  }

  private async persistAdsOnDB(ad: AdsArchiveItem) {
    try {
      const { page_id } = ad;
      const existsAd = await Ad.findOne({ page_id });
      if (existsAd !== null) return;
      const ad_data = await this.scrappingMetaPage(page_id);
      if (ad_data !== null) {
        console.log(ad_data);
        await new Ad({ ...ad, ...ad_data }).save();
      }
    } catch (err: any) {
      console.log(err);
    }
  }

  private async scrappingMetaPage(page_id: string) {
    Logger.printProgressMsg(`Scrapping page id: ${page_id}`);
    return await MetaScrapper.extractMetaPageInfo(page_id);
  }

  private async persistAdsOnFile(ad: AdsArchiveItem) {
    const { page_id, page_name, ad_delivery_start_time } = ad;
    const { ad_delivery_date_min, ad_delivery_date_max } = this.config;
    const file_name = `${ad_delivery_date_min}TO${ad_delivery_date_max}.csv`;
    const ad_data = `"${page_id}","${page_name}","${ad_delivery_start_time}";\n`;
    await appendFile(path.join(this.ads_data_path, file_name), ad_data);
  }
}
