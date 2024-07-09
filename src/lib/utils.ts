export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export enum USER_AGENT {
  MAC_OS = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
}

export const stringToBoolean = (word: string | undefined) => {
  if (word === undefined) return false;
  const boolMap: { [key: string]: boolean } = {
    true: true,
    false: false,
    yes: true,
    no: false,
    "1": true,
    "0": false,
  };
  return boolMap[word.toLowerCase()] ?? false;
};
