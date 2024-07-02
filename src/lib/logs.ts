import { styleText } from "node:util";

export type LoggerImp = {
  printErrMsg: (msg: string) => void;
  printProgressMsg: (msg: string) => void;
  printWarningMsg: (msg: string) => void;
};

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
