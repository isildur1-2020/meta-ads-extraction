import "dotenv/config";
import args from "./config/yargs";
import { MetaScrapper } from "./scrapper/meta/MetaScrapper";
import { Args } from "./lib/constants";

async function main() {
  const configArgs = args as Args;
  const metaScrapper = new MetaScrapper({
    limit: 1,
    search_terms: "ALL",
    ad_delivery_date_min: configArgs.since,
    ad_delivery_date_max: configArgs.until,
  });
  await metaScrapper.getAdsArchive();

  // if (ads) {
  //   for (let ad of ads) {
  //     const { page_id, page_name } = ad;
  //     const info = await extractMetaPageInfo(page_id);
  //     writeFile(
  //       "output.txt",
  //       `${page_name},${JSON.stringify(Object.values(info).join(","))}`
  //     );
  //     console.log(info);
  //   }
  // }
}

main();
