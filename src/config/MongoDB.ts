import mongoose from "mongoose";
import { ENV } from "./Env";
import { Logger } from "../lib/logs";

export class MongoDB {
  public static async connect() {
    try {
      const URL =
        ENV.APP_ENV === "dev"
          ? `mongodb://${ENV.MONGO_USER}:${ENV.MONGO_PASSWORD}@localhost:27017/${ENV.MONGO_DATABASE}`
          : `mongodb+srv://isildur1:Bo4YmN3Na7wPIj1i@cluster0.dv1hyol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
      await mongoose.connect(URL);
      Logger.printProgressMsg("MongoDB Atlas connected successfully");
    } catch (err: any) {
      Logger.printErrMsg("MongoDB Atlas error");
      Logger.printErrMsg(err);
    }
  }
}
