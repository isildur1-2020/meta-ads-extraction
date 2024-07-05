import chalk from "chalk";

export type LoggerImp = {
  printErrMsg: (msg: string) => void;
  printProgressMsg: (msg: string) => void;
  printWarningMsg: (msg: string) => void;
};

const log = console.log;

export class Logger {
  public static printErrMsg = (msg: string) => {
    log(chalk.red(msg));
  };

  public static printProgressMsg = (msg: string) => {
    log(chalk.green(msg));
  };

  public static printWarningMsg = (msg: string) => {
    log(chalk.cyan(msg));
  };
}
