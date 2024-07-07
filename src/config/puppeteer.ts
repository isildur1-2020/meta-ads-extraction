import { PuppeteerLaunchOptions } from "puppeteer";
import { getRandomNumber, getRandomProxie } from "../lib/utils";
import { ARGS } from "./Args";

export const puppeteerConfig = () => {
  const configDev: PuppeteerLaunchOptions = {
    headless: false,
    slowMo: getRandomNumber(150, 250),
    args: ["--window-size=800,700", `--proxy-server=${getRandomProxie()}`],
  };
  const configProd: PuppeteerLaunchOptions = {
    headless: true,
    executablePath: "/usr/bin/chromium",
    slowMo: getRandomNumber(150, 250),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  if (ARGS.APP_ENV === "prod") return configProd;
  return configDev;
};
