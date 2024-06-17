import mongoose from "mongoose";
import { ENV } from "./Env";
import { Logger } from "../lib/logs";

export class MongoDB {
  public static async connect() {
    try {
      const URL = `mongodb+srv://${ENV.MONGO_USER}:${ENV.MONGO_PASSWORD}@${ENV.MONGO_CLUSTER}/`;
      await mongoose.connect(URL);
      Logger.printProgressMsg("MongoDB Atlas connected successfully");
    } catch (err: any) {
      Logger.printErrMsg("MongoDB Atlas error");
      Logger.printErrMsg(err);
    }
  }
}
