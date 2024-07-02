import { Browser, Page } from "puppeteer";
import { ScrapperHTMLItem } from "../../lib/constants";
import { Puppeteer } from "../../lib/Puppeteer";
import { ENV } from "../../config/Env";
import { Logger } from "../../lib/logs";

export class MetaScrapper {
  private puppeteer: Puppeteer;
  private page: Page | null = null;
  private browser: Browser | null = null;
  private isLogged = false;

  constructor() {
    this.puppeteer = new Puppeteer();
  }

  public async init() {
    this.browser = await this.puppeteer.launchBrowser();
    this.page = await this.puppeteer.openPage();
  }

  public async extractMetaPageInfo(page_id: string) {
    const target = `https://www.facebook.com/${page_id}/`;
    await this.puppeteer.goto(target);
    await this.overridePermissions(target);
    if (!this.isLogged) {
      await this.metaLogin();
    }
    if (this.page) {
      await this.page.mouse.wheel({ deltaY: 400 });
    }
    const ad_data = await this.puppeteer.evaluate(this.locatePageInfo);
    return ad_data;
  }

  public async metaLogin() {
    if (!this.page) return null;

    await this.page.waitForSelector("#email");
    Logger.printProgressMsg("[SCRAPPING] TYPING EMAIL...");
    await this.page.type("#email", ENV.META_USERNAME);

    await this.page.waitForSelector("#pass");
    Logger.printProgressMsg("[SCRAPPING] TYPING PASSWORD...");
    await this.page.type("#pass", ENV.META_PASSWORD);

    await this.page.waitForSelector("#loginbutton");
    Logger.printProgressMsg("[SCRAPPING] SUBMIT LOGIN...");
    await Promise.all([
      this.page.click("#loginbutton"),
      this.page.waitForNavigation(),
    ]);

    this.isLogged = true;
  }

  public async overridePermissions(target: string) {
    if (this.browser) {
      const context = this.browser.defaultBrowserContext();
      await context.overridePermissions(target, []);
    }
  }

  private locatePageInfo() {
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
