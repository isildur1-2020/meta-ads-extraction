export class ARGS {
  public static APP_ENV = process.env.APP_ENV ?? "dev";
  public static MIN_LIMIT_ADS = Number(process.env.MIN_LIMIT_ADS) ?? null;
  public static MAX_LIMIT_ADS = Number(process.env.MAX_LIMIT_ADS) ?? null;
  public static AD_DELIVERY_DATE_MIN = process.env.AD_DELIVERY_DATE_MIN ?? "";
  public static AD_DELIVERY_DATE_MAX = process.env.AD_DELIVERY_DATE_MAX ?? "";
  public static PROXY_SERVER = process.env.PROXY_SERVER ?? null;

  public static MONGO_USER = process.env.MONGO_USER;
  public static MONGO_PASSWORD = process.env.MONGO_PASSWORD;
  public static MONGO_DATABASE = process.env.MONGO_DATABASE;
  public static MONGO_HOST = process.env.MONGO_HOST;

  public static META_APP_ID = process.env.META_APP_ID ?? "";
  public static META_USERNAME = process.env.META_USERNAME ?? "";
  public static META_PASSWORD = process.env.META_PASSWORD ?? "";
  public static META_LONG_TOKEN = process.env.META_LONG_TOKEN ?? "";
}
