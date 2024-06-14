import "dotenv/config";
import args from "./config/yargs";
import { writeFile } from "fs/promises";
import { getAdsArchive } from "./services/meta/adsArchiveService";
import { extractMetaPageInfo } from "./scrapper/meta/adsArchiveScrapper";

async function main() {
  try {
    const ads = await getAdsArchive();
    if (ads) {
      for (let ad of ads) {
        const { page_id, page_name } = ad;
        const info = await extractMetaPageInfo(page_id);
        writeFile(
          "output.txt",
          `${page_name},${JSON.stringify(Object.values(info).join(","))}`
        );
        console.log(info);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

main();
