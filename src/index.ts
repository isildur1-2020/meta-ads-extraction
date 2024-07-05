import "dotenv/config";
import { MongoDB } from "./config/MongoDB";
import { CompanyService } from "./services/CompanyService";
import { MetaScrapper } from "./scrapper/MetaScrapper";
import { metaExtractorConfig } from "./config/metaScrapper";
import { Logger } from "./lib/logs";
import { MetaExtractor } from "./scrapper/MetaExtractor";
import { MetaCookies } from "./scrapper/MetaCookies";
// import { Company } from "./models/Company";

async function main() {
  try {
    await MongoDB.connect();
    // await Company.updateMany({ was_used: true });
    // return;
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
