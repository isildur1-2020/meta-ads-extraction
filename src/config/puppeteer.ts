import { PuppeteerLaunchOptions } from "puppeteer";
import { getRandomNumber } from "../lib/utils";
import { ENV } from "./Env";

export const puppeteerConfig = () => {
  const configDev: PuppeteerLaunchOptions = {
    headless: false,
    slowMo: getRandomNumber(150, 250),
    args: ["--window-size=800,700"],
  };
  const configProd: PuppeteerLaunchOptions = {
    headless: true,
    slowMo: getRandomNumber(150, 250),
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  if (ENV.APP_ENV === "dev") return configDev;
  return configProd;
};
