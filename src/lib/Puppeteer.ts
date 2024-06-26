import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer";
import { getRandomNumber } from "./utils";
import { ENV } from "../config/Env";
import { Logger } from "./logs";

export class Puppeteer {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private launchOptions: PuppeteerLaunchOptions;

  constructor() {
    this.launchOptions = this.init();
  }

  private init() {
    const configDev = {
      headless: false,
      slowMo: getRandomNumber(1, 40),
      // args: [`--proxy-server=${getRandomProxie()}`],
    };
    const configProd = {
      headless: true,
      slowMo: getRandomNumber(1, 30),
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };
    if (ENV.APP_ENV === "dev") return configDev;
    return configProd;
  }

  public async launchBrowser() {
    try {
      Logger.printProgressMsg("[PUPPETEER] Starting browser...");
      const browser = await this.tryLaunchBrowser();
      return browser;
    } catch (err: any) {
      const message = `[PUPPETEER] Err: Launch browser\n${err}`;
      throw new Error(message);
    }
  }

  private async tryLaunchBrowser() {
    const browser = await puppeteer.launch(this.launchOptions);
    this.setBrowser(browser);
    return this.browser;
  }

  public async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  public async openPage() {
    try {
      Logger.printProgressMsg("[PUPPETEER] Opening page...");
      const page = await this.tryOpenPage();
      return page;
    } catch (err: any) {
      const message = `[PUPPETEER] Err: Open Page\n${err}`;
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
      const message = `[PUPPETEER] Err: goto\n${err}`;
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
      const message = `[PUPPETEER] Err: evaluate\n${err}`;
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
