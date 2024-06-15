import { styleText } from "node:util";

export class Logger {
  public static printErrMsg = (msg: string) => {
    console.log(styleText(["red", "bold"], msg));
  };

  public static printProgressMsg = (msg: string) => {
    console.log(styleText(["green", "bold"], msg));
  };

  public static printWarningMsg = (msg: string) => {
    console.log(styleText(["italic", "cyan"], msg));
  };
}
