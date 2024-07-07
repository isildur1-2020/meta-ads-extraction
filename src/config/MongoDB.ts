import { ARGS } from "./Args";
import mongoose from "mongoose";
import { Logger } from "../lib/logs";

export class MongoDB {
  public static async connect() {
    try {
      this.checkVariables();
      const URL = `mongodb://${ARGS.MONGO_USER}:${ARGS.MONGO_PASSWORD}@${ARGS.MONGO_HOST}:27017/${ARGS.MONGO_DATABASE}`;
      await mongoose.connect(URL);
      Logger.printProgressMsg("MongoDB Atlas connected successfully");
    } catch (err: any) {
      Logger.printErrMsg("[DATABASE] MongoDB Atlas error");
      throw new Error(err);
    }
  }

  private static checkVariables() {
    if (!ARGS.MONGO_USER) {
      throw new Error("[DATABASE] MONGO_USER must be defined");
    }
    if (!ARGS.MONGO_PASSWORD) {
      throw new Error("[DATABASE] MONGO_PASSWORD must be defined");
    }
    if (!ARGS.MONGO_HOST) {
      throw new Error("[DATABASE] MONGO_HOST must be defined");
    }
    if (!ARGS.MONGO_DATABASE) {
      throw new Error("[DATABASE] MONGO_HOST must be defined");
    }
  }
}
