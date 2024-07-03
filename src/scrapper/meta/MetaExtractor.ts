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
import { MetaScrapper } from "./MetaScrapper";
import { getRandomNumber } from "../../lib/utils";
import { CompanyService } from "../../services/CompanyService";
import { Slepper } from "../../lib/Slepper";

export class MetaExtractor {
  private adsExtracted = 0;
  private randomNumber: number = 0;
  private rateLimits: BUC_ITEM | null = null;
  private config: MetaScrapperConfig;
  private companyService: CompanyService;
  private metaScrapper: MetaScrapper;

  constructor(
    config: MetaScrapperConfig,
    companyService: CompanyService,
    metaScrapper: MetaScrapper
  ) {
    this.config = config;
    this.companyService = companyService;
    this.metaScrapper = metaScrapper;
  }

  public async getAdsArchive() {
    try {
      await this.metaScrapper.init();
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
    this.generateRandomNumber();
    const adsArchive = await MetaServices.getAdsArchive({
      ...this.config,
      limit: this.randomNumber,
      after: config?.after,
    });
    this.adsExtracted += this.randomNumber;
    const { ads, headers, paging } = adsArchive;
    if (ads.length === 0) {
      throw new Error("[META EXTRACTION] THERE IS NOT MORE RESULTS");
    }

    this.setRateLimits(headers as MetaResponseHeaders);
    this.printProgress();
    const clearedAds = this.clearAds(ads);
    await this.persistAdsData(clearedAds);
    await this.checkRateLimits();

    if (paging?.next) {
      this.tryGetAdsArchive({ after: paging.cursors.after });
    }
  }

  private generateRandomNumber() {
    const randomNumber = getRandomNumber(100, 250);
    this.setRandomNumber(randomNumber);
  }

  private printProgress() {
    if (!this.rateLimits) return;
    const {
      total_time,
      call_count,
      total_cputime,
      estimated_time_to_regain_access,
    } = this.rateLimits;
    Logger.printWarningMsg(
      `\n---------------------------------------------------\n` +
        `-- ADS EXTRACTED: ${this.randomNumber}\n` +
        `-- TOTAL ADS EXTRACTED: ${this.adsExtracted}\n` +
        `-- TOTAL PERCENTAGE: ${total_time}\n` +
        `-- CPU TIME: ${total_cputime}\n` +
        `-- CALL COUNT: ${call_count}\n` +
        `-- ESTIMATED WAIT TIME: ${estimated_time_to_regain_access}\n` +
        `---------------------------------------------------\n`
    );
  }

  private clearAds(ads: AdsArchiveItem[]): AdsArchiveItem[] {
    const adsIndexed = ads.reduce((prev, curr) => {
      const { page_id } = curr;
      return {
        ...prev,
        [page_id]: curr,
      };
    }, {});
    return Object.values(adsIndexed);
  }

  private async checkRateLimits() {
    if (!this.rateLimits) return;
    const { total_time, call_count } = this.rateLimits;
    if (total_time > 90 || call_count > 90) {
      const minutesToSleep = 60 * 24;
      Logger.printErrMsg(
        `[IMPORTANT] THE APP NEED TO SLEEP FOR ${minutesToSleep} MINUTES...`
      );
      await Slepper.wait({ minutes: minutesToSleep });
    }
  }

  private getRateLimits(headers: MetaResponseHeaders) {
    if (!ENV.SCRAPPER_ID) {
      throw new Error("SCRAPPER_ID must defined");
    }
    const limits = JSON.parse(headers["x-business-use-case-usage"]);
    return limits[ENV.SCRAPPER_ID][0] as BUC_ITEM;
  }

  private async persistAdsData(ads: AdsArchiveItem[]) {
    for (let ad of ads) {
      const { page_id } = ad;
      const companyFound = await this.companyService.findByPageId(page_id);
      if (companyFound) continue;
      const companyData = await this.scrappingPage(page_id);
      if (!companyData) continue;
      const { search_terms } = this.config;
      const payload = { ...ad, ...companyData, search_terms };
      this.printAdInfo(payload);
      await this.companyService.create(payload);
    }
  }

  private async scrappingPage(page_id: string) {
    Logger.printProgressMsg(`[SCRAPPING] PAGE ID ${page_id}`);
    return await this.metaScrapper.extractMetaPageInfo(page_id);
  }

  private printAdInfo(ad: AdsArchiveItem & AdScrappedItem) {
    const { page_id, address, email, phone, website, ad_delivery_start_time } =
      ad;
    Logger.printWarningMsg("-----------------------------------------------");
    Logger.printWarningMsg(`-- PAGE: ${page_id}`);
    Logger.printWarningMsg(`-- PHONE: ${phone}`);
    Logger.printWarningMsg(`-- EMAIL: ${email}`);
    Logger.printWarningMsg(`-- ADRRESS: ${address}`);
    Logger.printWarningMsg(`-- WEBSITE: ${website}`);
    Logger.printWarningMsg(`-- DELIVERY START TIME: ${ad_delivery_start_time}`);
    Logger.printWarningMsg("-----------------------------------------------");
  }

  private setRandomNumber(num: number) {
    this.randomNumber = num;
  }

  private setRateLimits(headers: MetaResponseHeaders) {
    const rateLimits = this.getRateLimits(headers);
    this.rateLimits = rateLimits;
  }
}
