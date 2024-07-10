import { AD_COUNTRIES } from "../lib/constants";
import { ARGS } from "./Args";

export const metaExtractorConfig = {
  search_terms: "",
  ad_delivery_date_min: ARGS.AD_DELIVERY_DATE_MIN,
  ad_delivery_date_max: ARGS.AD_DELIVERY_DATE_MAX,
  ad_reached_countries: [AD_COUNTRIES.ES],
};
