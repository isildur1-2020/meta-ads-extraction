import { Logger } from "./logs";

export class Slepper {
  private static counter = 0;
  private static minutes = 0;

  public static async wait({ minutes }: { minutes: number }) {
    this.minutes = minutes;
    const intervalId = setInterval(this.countTime, 1000);
    if (!intervalId) return null;
    const message = await this.waitFor();
    Logger.printProgressMsg(message);
    this.clean(intervalId);
  }

  private static countTime() {
    Slepper.printWaitTime(Slepper.minutes * 60 - Slepper.counter);
    Slepper.counter++;
  }

  private static printWaitTime(seconds: number) {
    Logger.printWarningMsg(
      `[SLEEPING] WAIT TIME: ${seconds} SECONDS. PLEASE BE PACIENT`
    );
  }

  private static async waitFor(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("[SLEEPPING] NO MORE WAITING.");
      }, Slepper.minutes * 60 * 1000);
    });
  }

  private static clean(intervalId: NodeJS.Timeout) {
    this.counter = 0;
    clearInterval(intervalId);
  }
}
