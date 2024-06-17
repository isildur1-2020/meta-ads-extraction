import "dotenv/config";
import { MongoDB } from "./config/MongoDB";
import { MetaExtractor } from "./scrapper/meta/MetaExtractor";
import { ENV } from "./config/Env";

async function main() {
  await MongoDB.connect();
  const metaScrapper = new MetaExtractor({
    limit: 250,
    search_terms: "ALL",
    ad_delivery_date_min: ENV.SCRAPPER_SINCE_DATE,
    ad_delivery_date_max: ENV.SCRAPPER_UNTIL_DATE,
  });
  await metaScrapper.getAdsArchive();
}

main();
