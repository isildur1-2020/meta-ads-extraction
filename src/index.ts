import "dotenv/config";
import args from "./config/yargs";
import { writeFile } from "fs/promises";
import { getAdsArchive } from "./services/meta/adsArchiveService";
import { extractMetaPageInfo } from "./scrapper/meta/adsArchiveScrapper";

async function main() {
  await getAdsArchive({
    limit: 2,
    search_terms: "ALL",
    ad_delivery_date_min: "2024-05-01",
    ad_delivery_date_max: "2024-05-31",
  });

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
