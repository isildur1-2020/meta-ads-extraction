import { styleText } from "node:util";

export const printErrMsg = (msg: string) => {
  console.log(styleText(["red", "bold"], msg));
};

export const printProgressMsg = (msg: string) => {
  console.log(styleText(["green"], msg));
};
