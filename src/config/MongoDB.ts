import { ARGS } from "./Args";
import mongoose from "mongoose";
import { Logger } from "../lib/logs";

export class MongoDB {
  public static async connect() {
    try {
      const URL =
        ARGS.APP_ENV === "prod"
          ? `mongodb+srv://isildur1:Bo4YmN3Na7wPIj1i@cluster0.dv1hyol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
          : `mongodb://${ARGS.MONGO_USER}:${ARGS.MONGO_PASSWORD}@localhost:27017/${ARGS.MONGO_DATABASE}`;
      await mongoose.connect(URL);
      Logger.printProgressMsg("MongoDB Atlas connected successfully");
    } catch (err: any) {
      Logger.printErrMsg("MongoDB Atlas error");
      Logger.printErrMsg(err);
    }
  }
}
