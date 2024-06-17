export class ENV {
  public static META_LONG_TOKEN = process.env.META_LONG_TOKEN;
  public static SCRAPPER_ID = process.env.SCRAPPER_ID;
  public static MONGO_USER = process.env.MONGO_USER;
  public static MONGO_PASSWORD = process.env.MONGO_PASSWORD;
  public static MONGO_CLUSTER = process.env.MONGO_CLUSTER;
  public static SCRAPPER_SINCE_DATE = process.env.SCRAPPER_SINCE_DATE ?? "";
  public static SCRAPPER_UNTIL_DATE = process.env.SCRAPPER_UNTIL_DATE ?? "";
}
