import { getRandomNumber } from "../lib/utils";
import { ENV } from "./Env";

export const puppeteerConfig = () => {
  const configDev = {
    headless: false,
    slowMo: 250,
    // slowMo: getRandomNumber(1, 40),
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
};
