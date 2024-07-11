import { PuppeteerLaunchOptions } from "puppeteer";
import { getRandomNumber } from "../lib/utils";
import { ARGS } from "./Args";

export const puppeteerConfig = () => {
  if (ARGS.PROXY_SERVER === null) {
    throw new Error("[PUPPETEER] PROXY_SERVER must be defined");
  }
  const configDev: PuppeteerLaunchOptions = {
    headless: false,
    slowMo: 250,
    args: [`--proxy-server=${ARGS.PROXY_SERVER}`],
  };
  const configProd: PuppeteerLaunchOptions = {
    headless: true,
    executablePath: "/usr/bin/chromium",
    slowMo: getRandomNumber(450, 700),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--proxy-server=${ARGS.PROXY_SERVER}`,
    ],
  };
  if (ARGS.APP_ENV === "prod") return configProd;
  return configDev;
};
