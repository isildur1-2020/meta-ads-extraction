import { join } from "path";
import { writeFile, readFile, access, constants } from "fs/promises";
import { Logger } from "../../lib/logs";
import { Cookie, CookieParam } from "puppeteer";

export type MetaCookiesImp = {
  get: () => Promise<CookieParam[] | null>;
  save: (cookies: Cookie[]) => Promise<void>;
};

export class MetaCookies implements MetaCookiesImp {
  private COOKIES_PATH = join(process.cwd(), "cookies.json");

  public async check() {
    try {
      await access(this.COOKIES_PATH, constants.F_OK);
      Logger.printProgressMsg("[COOKIES CHECK] COOKIES WAS FOUND SUCCESSFULLY");
      return true;
    } catch (err: any) {
      Logger.printErrMsg("[COOKIES CHECK] THERE ARE NO COOKIES SAVED");
      return false;
    }
  }

  public async get() {
    const thereAreCookies = await this.check();
    if (!thereAreCookies) return null;
    const cookiesSaved = await readFile(this.COOKIES_PATH, {
      encoding: "utf-8",
    });
    const cookiesParsed = JSON.parse(cookiesSaved);
    return cookiesParsed as CookieParam[];
  }

  public async save(cookies: Cookie[]) {
    try {
      await writeFile(this.COOKIES_PATH, JSON.stringify(cookies, null, 2));
      Logger.printProgressMsg("[COOKIES SAVE]: COOKIES SAVED SUCCESSFULLY");
    } catch (err) {
      Logger.printErrMsg(`[COOKIES SAVE]: ERR\n${err}`);
    }
  }
}
