import {
  BUC_ITEM,
  MetaResponseHeaders,
  MetaScrapperConfig,
} from "../lib/constants";
import { Logger } from "../lib/logs";
import { MetaServices } from "../services/MetaService";
import { AxiosError } from "axios";
import { ARGS } from "../config/Args";
import { getRandomNumber } from "../lib/utils";
import { Slepper } from "../lib/Slepper";
import { ScrapperPersisterImp } from "./ScrapperPersister";

export class MetaExtractor {
  private ADS_LIMIT = 0;
  private adsExtracted = 0;
  private rateLimits: BUC_ITEM | null = null;
  private config: MetaScrapperConfig;
  private scrapperPersister: ScrapperPersisterImp;

  constructor(
    config: MetaScrapperConfig,
    scrapperPersister: ScrapperPersisterImp
  ) {
    this.printConfig();
    this.config = config;
    this.scrapperPersister = scrapperPersister;
  }

  private printConfig() {
    Logger.printWarningMsg(
      `\n---------------------------------------------------\n` +
        `-- CONFIGURATION:\n` +
        `-- SEARCH TERMS: ${JSON.stringify(this.config.search_terms)}\n` +
        `-- AD DELIVERY DATE MIN: ${JSON.stringify(
          this.config.ad_delivery_date_min
        )}\n` +
        `-- AD DELIVERY DATE MAX: ${JSON.stringify(
          this.config.ad_delivery_date_max
        )}\n` +
        `-- AD REACHED COUNTRIES: ${JSON.stringify(
          this.config.ad_reached_countries
        )}\n` +
        `---------------------------------------------------\n`
    );
  }

  public async getAdsArchive() {
    try {
      this.checkConfigVariables();
      await this.tryGetAdsArchive();
    } catch (err: any) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data?.error);
      } else {
        console.log(err);
      }
    }
  }

  private checkConfigVariables() {
    if (ARGS.MIN_LIMIT_ADS === null) {
      throw new Error("[EXTRACTOR] MIN_LIMIT_ADS must be defined");
    }
    if (ARGS.MAX_LIMIT_ADS === null) {
      throw new Error("[EXTRACTOR] MAX_LIMIT_ADS must be defined");
    }
    this.ADS_LIMIT = getRandomNumber(ARGS.MIN_LIMIT_ADS, ARGS.MAX_LIMIT_ADS);
  }

  private async tryGetAdsArchive(config?: { after?: string }) {
    const adsArchive = await MetaServices.getAdsArchive({
      ...this.config,
      limit: this.ADS_LIMIT,
      after: config?.after,
    });
    this.adsExtracted += this.ADS_LIMIT;
    const { ads, headers, paging } = adsArchive;
    this.setRateLimits(headers as MetaResponseHeaders);
    this.printStatus();
    await this.scrapperPersister.checkAndSave(ads);
    await this.checkRateLimits();

    if (!paging?.next) {
      Logger.printProgressMsg("[EXTRACTION] THERE IS NOT MORE RESULTS");
      return;
    }
    await this.tryGetAdsArchive({ after: paging.cursors.after });
  }

  private printStatus() {
    if (!this.rateLimits) return;
    const {
      total_time,
      call_count,
      total_cputime,
      estimated_time_to_regain_access,
    } = this.rateLimits;
    Logger.printWarningMsg(
      `\n---------------------------------------------------\n` +
        `-- ADS EXTRACTED: ${this.ADS_LIMIT}\n` +
        `-- TOTAL ADS EXTRACTED: ${this.adsExtracted}\n` +
        `-- TOTAL PERCENTAGE: ${total_time}\n` +
        `-- CPU TIME: ${total_cputime}\n` +
        `-- CALL COUNT: ${call_count}\n` +
        `-- ESTIMATED WAIT TIME: ${estimated_time_to_regain_access}\n` +
        `---------------------------------------------------\n`
    );
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
    if (!ARGS.META_APP_ID) {
      throw new Error("META_APP_ID must be defined");
    }
    const limits = JSON.parse(headers["x-business-use-case-usage"]);
    return limits[ARGS.META_APP_ID][0] as BUC_ITEM;
  }

  private setRateLimits(headers: MetaResponseHeaders) {
    const rateLimits = this.getRateLimits(headers);
    this.rateLimits = rateLimits;
  }
}
