import { metaInstance } from "../../config/axios";
import { META_LONG_TOKEN } from "../../config/env";
import { AdsArchiveItem, MetaApiResponse } from "../../lib/constants";

export const getAdsArchive = async () => {
  const endpoint = "ads_archive";
  const data = await metaInstance.get<MetaApiResponse<AdsArchiveItem>>(
    endpoint,
    {
      params: {
        search_terms: "california",
        ad_type: "ALL",
        ad_reached_countries: JSON.stringify(["ES"]),
        access_token: META_LONG_TOKEN,
        fields: JSON.stringify(["page_id", "page_name"]),
      },
    }
  );
  return data?.data?.data;
};
