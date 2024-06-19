import { proxies } from "../config/proxies";

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomProxie() {
  const randomNumber = getRandomNumber(0, 99);
  return proxies[randomNumber];
}
