import { PuppeteerLaunchOptions } from "puppeteer";
import { getRandomNumber } from "../lib/utils";
import { ARGS } from "./Args";

export const puppeteerConfig = () => {
  const configDev: PuppeteerLaunchOptions = {
    headless: true,
    slowMo: getRandomNumber(150, 250),
    args: ["--window-size=800,700"],
  };
  const configProd: PuppeteerLaunchOptions = {
    headless: true,
    slowMo: getRandomNumber(150, 250),
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  if (ARGS.APP_ENV === "prod") return configProd;
  return configDev;
};
