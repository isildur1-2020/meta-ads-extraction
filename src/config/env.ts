export class ENV {
  public static META_LONG_TOKEN = process.env.META_LONG_TOKEN;
  public static SCRAPPER_ID = process.env.SCRAPPER_ID;
  public static MONGO_USER = process.env.MONGO_USER;
  public static MONGO_PASSWORD = process.env.MONGO_PASSWORD;
  public static MONGO_CLUSTER = process.env.MONGO_CLUSTER;
  public static APP_ENV = process.env.APP_ENV ?? "";
  public static META_USERNAME = process.env.META_USERNAME ?? "";
  public static META_PASSWORD = process.env.META_PASSWORD ?? "";
}
