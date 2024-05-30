import { styleText } from "node:util";

export const printErrMsg = (msg: string) => {
  console.log(styleText(["red", "bold"], msg));
};
