import { ARGS } from "./Args";
import mongoose from "mongoose";
import { Logger } from "../lib/logs";

export class MongoDB {
  public static async connect() {
    try {
      const URL = `mongodb://${ARGS.MONGO_USER}:${ARGS.MONGO_PASSWORD}@mongodb-kiwanas:27017/${ARGS.MONGO_DATABASE}`;
      await mongoose.connect(URL);
      Logger.printProgressMsg("MongoDB Atlas connected successfully");
    } catch (err: any) {
      Logger.printErrMsg("[DATABASE] MongoDB Atlas error");
      throw new Error(err);
    }
  }
}
