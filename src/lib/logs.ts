import chalk from "chalk";

export type LoggerImp = {
  printErrMsg: (msg: string) => void;
  printProgressMsg: (msg: string) => void;
  printWarningMsg: (msg: string) => void;
};

export class Logger {
  public static printErrMsg = (msg: string) => {
    // console.log(chalk.red.bold(msg));
    console.log(msg);
  };

  public static printProgressMsg = (msg: string) => {
    // console.log(chalk.green.bold);
    console.log(msg);
  };

  public static printWarningMsg = (msg: string) => {
    // console.log(chalk.italic.cyan);
    console.log(msg);
  };
}
