import {
  AdScrappedItem,
  AdsArchiveItem,
  BUC_ITEM,
  MetaResponseHeaders,
  MetaScrapperConfig,
} from "../../lib/constants";
import { Logger } from "../../lib/logs";
import { MetaServices } from "../../services/MetaService";
import { AxiosError } from "axios";
import { ENV } from "../../config/Env";
import { Ad } from "../../models/Ad";
import { MetaScrapper } from "./MetaScrapper";
import { getRandomNumber } from "../../lib/utils";

export class MetaExtractor {
  private counter = 0;
  private randomNumber: number = 0;

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
      `-- ADS DOWNLOADED: ${this.randomNumber}, ADS EXTRACTED: ${this.counter} --`
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
      const { page_id } = ad;
      const adFound = await Ad.findOne({ page_id });
      if (adFound === null) {
        await this.persistAdsOnDB(ad);
      }
    }
  }

  private async persistAdsOnDB(ad: AdsArchiveItem) {
    try {
      const { page_id } = ad;
      const ad_data = await this.scrappingMetaPage(page_id);
      if (ad_data !== null) {
        const payload = { ...ad, ...ad_data };
        this.printAdInfo(payload);
        await new Ad(payload).save();
      }
    } catch (err: any) {
      console.log(err);
    }
  }

  private printAdInfo(ad: AdsArchiveItem & AdScrappedItem) {
    const { page_id, address, email, phone, website } = ad;
    Logger.printWarningMsg("-------------------------------------");
    Logger.printWarningMsg(`-- PAGE: ${page_id}`);
    Logger.printWarningMsg(`-- PHONE: ${phone}`);
    Logger.printWarningMsg(`-- EMAIL: ${email}`);
    Logger.printWarningMsg(`-- ADRRESS: ${address}`);
    Logger.printWarningMsg(`-- WEBSITE: ${website}`);
    Logger.printWarningMsg("-------------------------------------");
  }

  private async scrappingMetaPage(page_id: string) {
    Logger.printProgressMsg(`[SCRAPPING] Page i\d: ${page_id}`);
    return await MetaScrapper.extractMetaPageInfo(page_id);
  }
}
