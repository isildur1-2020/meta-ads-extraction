import { getRandomNumber } from "../lib/utils";
import { ENV } from "./Env";

export const puppeteerConfig = () => {
  const configDev = {
    headless: true,
    slowMo: getRandomNumber(250, 300),
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
