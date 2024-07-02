import "dotenv/config";
import { MongoDB } from "./config/MongoDB";
import { MetaExtractor } from "./scrapper/meta/MetaExtractor";
import { CompanyService } from "./services/CompanyService";
import { MetaScrapper } from "./scrapper/meta/MetaScrapper";
import { metaExtractorConfig } from "./config/metaScrapper";

async function main() {
  await MongoDB.connect();
  const metaScrapper = new MetaExtractor(
    metaExtractorConfig,
    new CompanyService(),
    new MetaScrapper()
  );
  await metaScrapper.getAdsArchive();
}

main();
