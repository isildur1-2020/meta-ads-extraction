import "dotenv/config";
import args from "./config/yargs";
import { MetaScrapper } from "./scrapper/meta/MetaScrapper";
import { Args } from "./lib/constants";
import { extractMetaPageInfo } from "./scrapper/meta/adsArchiveScrapper";

async function main() {
  const configArgs = args as Args;
  const metaScrapper = new MetaScrapper({
    limit: 250,
    search_terms: "ALL",
    // ad_delivery_date_min: configArgs.since,
    // ad_delivery_date_max: configArgs.until,
    ad_delivery_date_min: "2024-05-10",
    ad_delivery_date_max: "2024-05-20",
  });
  await metaScrapper.getAdsArchive();

  // const info = await extractMetaPageInfo("remax.casa05");
  // console.log(info);

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
