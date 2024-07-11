import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer";
import { Logger } from "./logs";
import { puppeteerConfig } from "../config/puppeteer";

export class Puppeteer {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private launchOptions: PuppeteerLaunchOptions;

  constructor() {
    this.launchOptions = puppeteerConfig();
  }

  public async launchBrowser() {
    try {
      Logger.printProgressMsg("[PUPPETEER] STARTING BROWSER...");
      const browser = await this.tryLaunchBrowser();
      return browser;
    } catch (err: any) {
      const message = `[PUPPETEER] ERR: LAUNCHING BROWSER\n${err}`;
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
      Logger.printProgressMsg("[PUPPETEER] OPENING PAGE...");
      const page = await this.tryOpenPage();
      return page;
    } catch (err: any) {
      const message = `[PUPPETEER] ERR: OPENING PAGE...\n${err}`;
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
      const message = `[PUPPETEER] ERR: GOTO\n${err}`;
      console.log(message, err);
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
      const message = `[PUPPETEER] ERR: EVALUATE\n${err}`;
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
