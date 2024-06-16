import { metaInstance } from "../config/axios";
import { META_LONG_TOKEN } from "../config/env";
import {
  AD_COUNTRIES,
  AD_FIELDS,
  AD_MEDIA_TYPE,
  AD_PUBLISHER_PLATFORMS,
  AD_TYPE,
  AdsArchiveItem,
  AdsArchiveServiceParams,
  MetaApiResponse,
} from "../lib/constants";

export class MetaServices {
  public static async getAdsArchive(
    config: AdsArchiveServiceParams & { after?: string; limit: number }
  ) {
    const {
      limit,
      after,
      search_terms,
      ad_delivery_date_min,
      ad_delivery_date_max,
    } = config;
    const { data, headers } = await metaInstance.get<
      MetaApiResponse<AdsArchiveItem>
    >("ads_archive", {
      params: {
        after: after || "",
        limit,
        access_token: META_LONG_TOKEN,
        fields: JSON.stringify([AD_FIELDS.PAGE_ID, AD_FIELDS.PAGE_NAME]),
        /*
         * Search for ads based on the status.
         * Defaults to ACTIVE for all ads that are eligible for delivery.
         * Set INACTIVE for ads ineligible for delivery,
         * and ALL for both types.
         */
        // ad_active_status: AD_ACTIVE_STATUS.ACTIVE,
        /*
         * Search for ads delivered before the date (inclusive) you provide.
         * The date format should be YYYY-mm-dd.
         */
        ad_delivery_date_max,
        /*
         * Search for ads delivered before the date (inclusive) you provide.
         * The date format should be YYYY-mm-dd.
         */
        ad_delivery_date_min,
        /*
         * REQUIRED
         * Search ALL or by ISO country code to return ads that reached specific countries
         * or locations. Note: Ads that did not reach any location in the EU will only
         * returnif they are about social issues, elections or politics.
         */
        ad_reached_countries: JSON.stringify([AD_COUNTRIES.ES]),
        /*
         * Search by type of ad. You can use this to narrow your results to ads in special
         * ad categories: CREDIT_ADS returns ads related to financial products or institutions.
         * EMPLOYMENT_ADS returns ads related to job listings or employment opportunities.
         * HOUSING_ADS returns housing or real estate ads.
         * POLITICAL_AND_ISSUE_ADS returns ads about social issues, elections or politics.
         * ALL returns ads on all topics.
         */
        ad_type: AD_TYPE.ALL,
        /*
         * Filter results for ads with a paid for by disclaimer byline,
         * such as political ads that reference “immigration” paid for by “ACLU”.
         * Provide a JSON array to search for a byline without a comma or one with a comma.
         * For instance ?bylines=["byline, with a comma,","byline without a comma"]
         * returns results with either text variation. You must list the complete byline.
         * For example, 'Maria' would not return ads with the byline 'Maria C. Lee for America.'
         * Available only for POLITICAL_AND_ISSUE_ADS
         */
        // bylines: '',
        /*
         * View ads by the region (such as state or province) where Accounts Center accounts
         * were based or located when an ad was displayed to them. You can provide a comma-separated
         * list of regions. For instance ?delivery_by_region=['California', 'New York'].
         * Available only for POLITICAL_AND_ISSUE_ADS
         */
        // delivery_by_region: [],
        /*
         * Search for ads with a maximum estimated audience size.
         * Must be one of these range boundaries: 1000, 5000, 10000, 50000, 100000, 500000, 1000000.
         * Leave empty for no maximum boundary. Available only for POLITICAL_AND_ISSUE_ADS
         */
        // estimated_audience_size_max: 0,
        /*
         * Search for ads with a maximum estimated audience size.
         * Must be one of these range boundaries: 1000, 5000, 10000, 50000, 100000, 500000, 1000000.
         * Leave empty for no maximum boundary. Available only for POLITICAL_AND_ISSUE_ADS
         */
        // estimated_audience_size_min: 0,
        /*
         * Search for ads based on the language(s) contained in the ad.
         * Language codes are based on the ISO 639-1 language codes and also includes ISO 639-3
         * language codes CMN and YUE.For instance ?languages=['es', 'en'].
         */
        // languajes: [],
        /*
         * Search for ads based on whether they contain a specific type of media,
         * such as an image or video.
         */
        media_type: AD_MEDIA_TYPE.ALL,
        /*
         * Search for ads based on whether they appear on a particular Meta technology,
         * such as Instagram or Facebook. You can provide one technology
         * or a comma-separatedlist of technologies.
         */
        publisher_platforms: JSON.stringify([
          AD_PUBLISHER_PLATFORMS.FACEBOOK,
          AD_PUBLISHER_PLATFORMS.INSTAGRAM,
        ]),
        /*
         * Search for archived ads based on specific Facebook Page IDs.
         * You can provide up to ten IDs, separated by commas.
         */
        // search_page_ids: [],
        /*
         * Default value ""
         * The terms to search for in your query.
         * We treat a blank space as a logical AND and search
         * for both terms and no other operators.
         * The limit of your string is 100 characters or less.
         * Use search_type to adjust the type of search to use.
         */
        search_terms,
        /*
         * Default value: KEYWORD_UNORDERED
         * The type of search to use for the search_terms field.
         * KEYWORD_UNORDERED will treat each word in search_terms individually,
         * and return results that contain these words in any order.
         * KEYWORD_EXACT_PHRASE will treat the words in search_terms as a single phrase,
         * and only return results that match that exact phrase.
         * To search for multiple phrases at once, separate groups of words in search_terms by commas.
         * This will retrieve results that contain an exact match for every phrase.
         */
        // search_type: AD_SEARCH_TYPE.KEYWORD_UNORDERED,
        /*
         * Default value: false
         * Specify whether you would like your results to reveal content
         * that was removedfor violating our standards.
         */
        // unmask_removed_content: false,
      },
    });
    return {
      headers,
      ads: data.data,
      paging: data.paging,
    };
  }
}
