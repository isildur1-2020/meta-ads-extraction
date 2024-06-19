import "dotenv/config";
import { MongoDB } from "./config/MongoDB";
import { MetaExtractor } from "./scrapper/meta/MetaExtractor";
import { ENV } from "./config/Env";
import { CompanyService } from "./services/CompanyService";

async function main() {
  await MongoDB.connect();
  const metaScrapper = new MetaExtractor(
    {
      search_terms: "ALL",
      ad_delivery_date_min: ENV.SCRAPPER_SINCE_DATE,
      ad_delivery_date_max: ENV.SCRAPPER_UNTIL_DATE,
    },
    new CompanyService()
  );
  await metaScrapper.getAdsArchive();
}

main();
