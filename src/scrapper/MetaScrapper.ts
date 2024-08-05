import { Browser, Page } from "puppeteer";
import { AdScrappedItem, ScrapperHTMLItem } from "../lib/constants";
import { Puppeteer } from "../lib/Puppeteer";
import { ARGS } from "../config/Args";
import { Logger } from "../lib/logs";
import { getRandomNumber, USER_AGENT } from "../lib/utils";
import { MetaCookiesImp } from "./MetaCookies";

export interface MetaScrapperImp {
  extractMetaPageInfo: (page_id: string) => Promise<AdScrappedItem | null>;
}

export class MetaScrapper implements MetaScrapperImp {
  private puppeteer: Puppeteer;
  private metaCookies: MetaCookiesImp;
  private page: Page | null = null;
  private browser: Browser | null = null;
  private isLogged: boolean = false;

  constructor(metaCookies: MetaCookiesImp) {
    this.puppeteer = new Puppeteer();
    this.metaCookies = metaCookies;
  }

  public async extractMetaPageInfo(page_id: string) {
    await this.init();
    if (!this.page) {
      throw new Error("[EXTRACTION] PAGE MUST BE DEFINED");
    }
    const target = `https://www.facebook.com/${page_id}/`;
    // TO DO, IMPROVE OVERRIDE PERMISSIONS
    await this.overridePermissions(target);
    await this.page.setUserAgent(USER_AGENT.MAC_OS);

    try {
      await this.puppeteer.goto(target);
    } catch (err) {
      return null;
    }

    if (!this.isLogged) {
      await this.metaLogin();
    }

    await this.page.mouse.wheel({ deltaY: getRandomNumber(400, 500) });

    try {
      const extractedData = await this.puppeteer.evaluate(this.locatePageInfo);
      return extractedData;
    } catch (err) {
      return null;
    }
  }

  private async init() {
    if (this.browser === null) {
      this.browser = await this.puppeteer.launchBrowser();
    }
    if (this.page === null) {
      this.page = await this.puppeteer.openPage();
    }
  }

  private async metaLogin() {
    if (!this.page) {
      throw new Error("[META LOGIN] PAGE MUST BE DEFINED");
    }

    const cookies = await this.metaCookies.get();
    if (cookies) {
      await this.page.setCookie(...cookies);
      this.isLogged = true;
      return;
    }

    await this.page.waitForSelector("#email");
    Logger.printProgressMsg("[SCRAPPING] TYPING EMAIL...");
    await this.page.type("#email", ARGS.META_USERNAME);

    await this.page.waitForSelector("#pass");
    Logger.printProgressMsg("[SCRAPPING] TYPING PASSWORD...");
    await this.page.type("#pass", ARGS.META_PASSWORD);

    await this.page.waitForSelector("#loginbutton");
    Logger.printProgressMsg("[SCRAPPING] SUBMIT LOGIN...");
    await Promise.all([
      this.page.click("#loginbutton"),
      this.page.waitForNavigation(),
    ]);

    const currentCookies = await this.page.cookies();
    await this.metaCookies.save(currentCookies);
    this.isLogged = true;
  }

  private async overridePermissions(target: string) {
    if (this.browser) {
      const context = this.browser.defaultBrowserContext();
      await context.overridePermissions(target, []);
    }
  }

  private locatePageInfo(): AdScrappedItem | null {
    const getClosestText = (props: ScrapperHTMLItem): string => {
      const { iconClass, parentClass, contentClass } = props;
      const iconNode = document.querySelector(iconClass);
      if (!iconNode) return "";
      const parentNode = iconNode.closest(parentClass);
      if (!parentNode) return "";
      const content = parentNode.querySelector(contentClass);
      if (!content) return "";
      return content.innerHTML;
    };
    const addressClasses = {
      iconClass:
        "img[src='https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/bwmGKGh4YjO.png']",
      parentClass:
        "div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1nhvcw1.x1qjc9v5.xozqiw3.x1q0g3np.xyamay9.xykv574.xbmpl8g.x4cne27.xifccgj",
      contentClass:
        "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u",
    };
    const phoneClasses = {
      iconClass:
        "img[src='https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/VIGUiR6qVQJ.png']",
      parentClass:
        "div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1nhvcw1.x1qjc9v5.xozqiw3.x1q0g3np.xyamay9.xykv574.xbmpl8g.x4cne27.xifccgj",
      contentClass:
        "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h",
    };
    const emailClasses = {
      iconClass:
        "img[src='https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/KVUi1wUrbfb.png']",
      parentClass:
        "div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1nhvcw1.x1qjc9v5.xozqiw3.x1q0g3np.xyamay9.xykv574.xbmpl8g.x4cne27.xifccgj",
      contentClass:
        "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h",
    };
    const websiteClasses = {
      iconClass:
        "img[src='https://static.xx.fbcdn.net/rsrc.php/v3/y4/r/UF-jk_lKW5x.png']",
      parentClass:
        "div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1nhvcw1.x1qjc9v5.xozqiw3.x1q0g3np.xyamay9.xykv574.xbmpl8g.x4cne27.xifccgj",
      contentClass:
        "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.x1qq9wsj.x1yc453h",
    };
    const email = getClosestText(emailClasses);
    if (!email) return null;

    return {
      email,
      phone: getClosestText(phoneClasses),
      address: getClosestText(addressClasses),
      website: getClosestText(websiteClasses),
    };
  }
}
