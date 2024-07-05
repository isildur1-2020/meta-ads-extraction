import "dotenv/config";
import { MongoDB } from "./config/MongoDB";
import { MetaExtractor } from "./scrapper/meta/MetaExtractor";
import { CompanyService } from "./services/CompanyService";
import { MetaScrapper } from "./scrapper/meta/MetaScrapper";
import { metaExtractorConfig } from "./config/metaScrapper";
import { Logger } from "./lib/logs";
import { MetaCookies } from "./scrapper/meta/MetaCookies";

async function main() {
  try {
    await MongoDB.connect();
    const metaScrapper = new MetaExtractor(
      metaExtractorConfig,
      new CompanyService(),
      new MetaScrapper(new MetaCookies())
    );
    await metaScrapper.getAdsArchive();
  } catch (err: any) {
    Logger.printErrMsg(err);
  }
}

main();
