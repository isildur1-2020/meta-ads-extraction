import { AdsArchiveItem, BUC, MetaScrapperConfig } from "../../lib/constants";
import { Logger } from "../../lib/logs";
import { MetaServices } from "../../services/meta/adsArchiveService";
import { SCRAPPER_ID } from "../../config/env";

export class MetaScrapper {
  private counter = 1;
  private data_companies = new Map();

  constructor(private config: MetaScrapperConfig) {}

  public async getAdsArchive() {
    try {
      // await this.tryGetAdsArchive();
      //   await appendFile(
      //     "output.txt",
      //     JSON.stringify(this.data_companies.keys())
      //   );
      Logger.printProgressMsg("HELLO WORLD");
    } catch (err: any) {
      console.log(err);
      console.log(err?.response?.data?.error);
    }
  }

  private async tryGetAdsArchive(config?: { after?: string }) {
    const { ads, limits, paging } = await MetaServices.getAdsArchive({
      ...this.config,
      after: config?.after,
    });
    this.printExtractionProgress();
    this.printLimits(limits);

    this.saveOnRAM(ads);
    if (paging?.next) {
      this.tryGetAdsArchive({ after: paging.cursors.after });
      this.counter++;
    }
  }

  private printExtractionProgress() {
    const { limit } = this.config;
    Logger.printProgressMsg(`## ADS EXTRACTED ${this.counter * limit}`);
  }

  private printLimits(limits: BUC) {
    const { total_cputime, total_time } = this.getLimits(limits);
    const message = `-- CPU_TIME ${total_cputime} -- TOTAL PERCENTAGE ${total_time} --`;
    Logger.printWarningMsg(message);
  }

  private getLimits(limits: BUC) {
    if (!SCRAPPER_ID) {
      throw new Error("SCRAPPER_ID must defined");
    }
    return limits[SCRAPPER_ID][0];
  }

  private async saveOnRAM(ads: AdsArchiveItem[]) {
    for (let ad of ads) {
      const { page_id, page_name } = ad;
      if (!this.data_companies.has(page_id)) {
        this.data_companies.set(page_id, page_name);
      }
    }
  }
}
