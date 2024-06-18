import puppeteer, { Browser, Page } from "puppeteer";
import { getRandomNumber } from "./utils";
import { ENV } from "../config/Env";
import { Logger } from "./logs";

export type PuppeteerImp = {
  launchBrowser: () => Promise<Browser | null>;
  openPage: () => Promise<Page | null>;
  goto: (URL: string) => Promise<void>;
  evaluate: <T>(handleEvaluate: () => T) => Promise<T | null>;
};

export class Puppeteer implements PuppeteerImp {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private configDev = {
    headless: true,
    slowMo: getRandomNumber(1, 20),
  };
  private configProd = {
    ...this.configDev,
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  private config = ENV.APP_ENV === "dev" ? this.configDev : this.configProd;

  public async launchBrowser() {
    try {
      Logger.printProgressMsg("-> Starting browser...");
      const browser = await this.tryLaunchBrowser();
      Logger.printProgressMsg("-> Browser started.");
      return browser;
    } catch (err: any) {
      const message = `Err: Launch browser\n${err}`;
      throw new Error(message);
    }
  }

  private async tryLaunchBrowser() {
    const browser = await puppeteer.launch(this.config);
    this.setBrowser(browser);
    return this.browser;
  }

  public async openPage() {
    try {
      Logger.printProgressMsg("-> Opening page...");
      const page = await this.tryOpenPage();
      Logger.printProgressMsg("-> Page opened.");
      return page;
    } catch (err: any) {
      const message = `Err: Open Page\n${err}`;
      throw new Error(message);
    }
  }

  private async tryOpenPage() {
    if (!this.browser) return null;
    const page = await this.browser.newPage();
    this.setPage(page);
    return this.page;
  }

  public async goto(URL: string) {
    try {
      await this.tryGoto(URL);
    } catch (err: any) {
      const message = `Err: goto\n${err}`;
      throw new Error(message);
    }
  }

  public async tryGoto(URL: string) {
    if (this.page) {
      await this.page.goto(URL);
    }
  }

  public async evaluate<T>(handleEvaluate: () => T) {
    try {
      return await this.tryEvaluate(handleEvaluate);
    } catch (err: any) {
      const message = `Err: evaluate\n${err}`;
      throw new Error(message);
    }
  }

  private async tryEvaluate<T>(handleEvaluate: () => T) {
    if (!this.page) return null;
    return await this.page.evaluate(handleEvaluate);
  }

  private setBrowser(browser: Browser) {
    this.browser = browser;
  }

  private setPage(page: Page) {
    this.page = page;
  }

  public getBrowser() {
    return this.browser;
  }

  public getPage() {
    return this.page;
  }
}
