import { AdsArchiveItem, AdScrappedItem } from "../lib/constants";
import { Logger } from "../lib/logs";
import { CompanyServiceImp } from "../services/CompanyService";
import { MetaScrapperImp } from "./MetaScrapper";

export interface ScrapperPersisterImp {
  checkAndSave: (ads: AdsArchiveItem[]) => Promise<void>;
}

export class ScrapperPersister implements ScrapperPersisterImp {
  constructor(
    private companyService: CompanyServiceImp,
    private metaScrapper: MetaScrapperImp,
    private search_terms: string
  ) {}

  public async checkAndSave(ads: AdsArchiveItem[]) {
    const adsCleared = this.clearAds(ads);
    for (let ad of adsCleared) {
      const { page_id } = ad;
      const existsCompany = await this.existsCompany(page_id);
      if (existsCompany) continue;

      const extractedData = await this.scrappingPage(page_id);
      await this.persistExtraction({ ad, extractedData });
    }
  }

  private clearAds(ads: AdsArchiveItem[]) {
    const adsIndexed = ads.reduce((prev, curr) => {
      const { page_id } = curr;
      return {
        ...prev,
        [page_id]: curr,
      };
    }, {});
    const adsCleared = Object.values(adsIndexed) as AdsArchiveItem[];
    Logger.printProgressMsg(
      `[CLEAR ADS] ADS EXTRACTED: ${ads.length} - ADS CLEARED: ${adsCleared.length}`
    );
    return adsCleared;
  }

  private async existsCompany(page_id: string) {
    const companyFound = await this.companyService.findByPageId(page_id);
    if (companyFound) {
      Logger.printErrMsg(`[COMPANY SERVICE] PAGE ID ${page_id} ALREADY EXISTS`);
      return true;
    }
    return false;
  }

  private async scrappingPage(page_id: string) {
    Logger.printProgressMsg(`[SCRAPPING] PAGE ID ${page_id}`);
    const extractedData = await this.metaScrapper.extractMetaPageInfo(page_id);
    return extractedData;
  }

  private async persistExtraction({
    ad,
    extractedData,
  }: {
    ad: AdsArchiveItem;
    extractedData: AdScrappedItem | null;
  }) {
    let payload: AdsArchiveItem & { search_terms: string };
    if (extractedData === null) {
      payload = {
        ...ad,
        address: "",
        phone: "",
        website: "",
        email: "",
        has_contact_info: false,
        search_terms: this.search_terms,
      };
    } else {
      payload = {
        ...ad,
        ...extractedData,
        search_terms: this.search_terms,
      };
    }
    await this.companyService.create(payload);
  }
}
