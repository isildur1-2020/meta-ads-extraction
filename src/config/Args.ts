import { stringToBoolean } from "../lib/utils";

export class ARGS {
  public static WITH_META_COOKIES = stringToBoolean(
    process.env.WITH_META_COOKIES
  );
  public static META_LONG_TOKEN = process.env.META_LONG_TOKEN ?? "";
  public static META_APP_ID = process.env.META_APP_ID ?? "";
  public static MONGO_USER = process.env.MONGO_USER;
  public static MONGO_PASSWORD = process.env.MONGO_PASSWORD;
  public static MONGO_DATABASE = process.env.MONGO_DATABASE;
  public static MONGO_HOST = process.env.MONGO_HOST;
  public static APP_ENV = process.env.APP_ENV ?? "";
  public static META_USERNAME = process.env.META_USERNAME ?? "";
  public static META_PASSWORD = process.env.META_PASSWORD ?? "";
}
