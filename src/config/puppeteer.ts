import { PuppeteerLaunchOptions } from "puppeteer";
import { getRandomNumber } from "../lib/utils";
import { ARGS } from "./Args";

export const puppeteerConfig = () => {
  const configDev: PuppeteerLaunchOptions = {
    slowMo: 250,
    headless: false,
    // args: ARGS.PROXY_SERVER ? [`--proxy-server=${ARGS.PROXY_SERVER}`] : [],
    args: ["--window-size=785,600"],
  };
  const configProd: PuppeteerLaunchOptions = {
    headless: true,
    executablePath: "/usr/bin/chromium",
    slowMo: getRandomNumber(450, 700),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  if (ARGS.APP_ENV === "prod") return configProd;
  return configDev;
};
