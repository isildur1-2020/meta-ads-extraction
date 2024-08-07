export type MetaApiResponse<T> = {
  data: T[];
  paging: MetaApiPaging;
};

export type AdScrappedItem = {
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
};

export interface AdsArchiveItem extends AdScrappedItem {
  id: string;
  page_name: string;
  page_id: string;
  has_contact_info?: boolean;
  ad_delivery_start_time: string;
  ad_snapshot_url: string;
}

export type MetaApiPaging = {
  cursors: {
    after: string;
  };
  next?: string;
};

export type AdsArchiveServiceFullParams = {
  ad_active_status: AD_ACTIVE_STATUS;
  ad_delivery_date_max: string;
  ad_delivery_date_min: string;
  ad_reached_countries: AD_COUNTRIES[];
  ad_type: string;
  bylines: string;
  delivery_by_region: string[];
  estimated_audience_size_max: number;
  estimated_audience_size_min: number;
  languajes: string[];
  media_type: AD_MEDIA_TYPE;
  publisher_platforms: AD_PUBLISHER_PLATFORMS[];
  search_page_ids: number[];
  search_terms: string;
  search_type: AD_SEARCH_TYPE;
  unmask_removed_content: boolean;
};

export type AdsArchiveServiceParams = Pick<
  AdsArchiveServiceFullParams,
  | "ad_delivery_date_min"
  | "ad_delivery_date_max"
  | "search_terms"
  | "ad_reached_countries"
>;

export enum AD_ACTIVE_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ALL = "ALL",
}

export enum AD_COUNTRIES {
  ALL = "ALL",
  BR = "BR",
  IN = "IN",
  GB = "GB",
  US = "US",
  CA = "CA",
  AR = "AR",
  AU = "AU",
  AT = "AT",
  BE = "BE",
  CL = "CL",
  CN = "CN",
  CO = "CO",
  HR = "HR",
  DK = "DK",
  DO = "DO",
  EG = "EG",
  FI = "FI",
  FR = "FR",
  DE = "DE",
  GR = "GR",
  HK = "HK",
  ID = "ID",
  IE = "IE",
  IL = "IL",
  IT = "IT",
  JP = "JP",
  JO = "JO",
  KW = "KW",
  LB = "LB",
  MY = "MY",
  MX = "MX",
  NL = "NL",
  NZ = "NZ",
  NG = "NG",
  NO = "NO",
  PK = "PK",
  PA = "PA",
  PE = "PE",
  PH = "PH",
  PL = "PL",
  RU = "RU",
  SA = "SA",
  RS = "RS",
  SG = "SG",
  ZA = "ZA",
  KR = "KR",
  ES = "ES",
  SE = "SE",
  CH = "CH",
  TW = "TW",
  TH = "TH",
  TR = "TR",
  AE = "AE",
  VE = "VE",
  PT = "PT",
  LU = "LU",
  BG = "BG",
  CZ = "CZ",
  SI = "SI",
  IS = "IS",
  SK = "SK",
  LT = "LT",
  TT = "TT",
  BD = "BD",
  LK = "LK",
  KE = "KE",
  HU = "HU",
  MA = "MA",
  CY = "CY",
  JM = "JM",
  EC = "EC",
  RO = "RO",
  BO = "BO",
  GT = "GT",
  CR = "CR",
  QA = "QA",
  SV = "SV",
  HN = "HN",
  NI = "NI",
  PY = "PY",
  UY = "UY",
  PR = "PR",
  BA = "BA",
  PS = "PS",
  TN = "TN",
  BH = "BH",
  VN = "VN",
  GH = "GH",
  MU = "MU",
  UA = "UA",
  MT = "MT",
  BS = "BS",
  MV = "MV",
  OM = "OM",
  MK = "MK",
  LV = "LV",
  EE = "EE",
  IQ = "IQ",
  DZ = "DZ",
  AL = "AL",
  NP = "NP",
  MO = "MO",
  ME = "ME",
  SN = "SN",
  GE = "GE",
  BN = "BN",
  UG = "UG",
  GP = "GP",
  BB = "BB",
  AZ = "AZ",
  TZ = "TZ",
  LY = "LY",
  MQ = "MQ",
  CM = "CM",
  BW = "BW",
  ET = "ET",
  KZ = "KZ",
  NA = "NA",
  MG = "MG",
  NC = "NC",
  MD = "MD",
  FJ = "FJ",
  BY = "BY",
  JE = "JE",
  GU = "GU",
  YE = "YE",
  ZM = "ZM",
  IM = "IM",
  HT = "HT",
  KH = "KH",
  AW = "AW",
  PF = "PF",
  AF = "AF",
  BM = "BM",
  GY = "GY",
  AM = "AM",
  MW = "MW",
  AG = "AG",
  RW = "RW",
  GG = "GG",
  GM = "GM",
  FO = "FO",
  LC = "LC",
  KY = "KY",
  BJ = "BJ",
  AD = "AD",
  GD = "GD",
  VI = "VI",
  BZ = "BZ",
  VC = "VC",
  MN = "MN",
  MZ = "MZ",
  ML = "ML",
  AO = "AO",
  GF = "GF",
  UZ = "UZ",
  DJ = "DJ",
  BF = "BF",
  MC = "MC",
  TG = "TG",
  GL = "GL",
  GA = "GA",
  GI = "GI",
  CD = "CD",
  KG = "KG",
  PG = "PG",
  BT = "BT",
  KN = "KN",
  SZ = "SZ",
  LS = "LS",
  LA = "LA",
  LI = "LI",
  MP = "MP",
  SR = "SR",
  SC = "SC",
  VG = "VG",
  TC = "TC",
  DM = "DM",
  MR = "MR",
  AX = "AX",
  SM = "SM",
  SL = "SL",
  NE = "NE",
  CG = "CG",
  AI = "AI",
  YT = "YT",
  CV = "CV",
  GN = "GN",
  TM = "TM",
  BI = "BI",
  TJ = "TJ",
  VU = "VU",
  SB = "SB",
  ER = "ER",
  WS = "WS",
  AS = "AS",
  FK = "FK",
  GQ = "GQ",
  TO = "TO",
  KM = "KM",
  PW = "PW",
  FM = "FM",
  CF = "CF",
  SO = "SO",
  MH = "MH",
  VA = "VA",
  TD = "TD",
  KI = "KI",
  ST = "ST",
  TV = "TV",
  NR = "NR",
  RE = "RE",
  LR = "LR",
  ZW = "ZW",
  CI = "CI",
  MM = "MM",
  AN = "AN",
  AQ = "AQ",
  BQ = "BQ",
  BV = "BV",
  IO = "IO",
  CX = "CX",
  CC = "CC",
  CK = "CK",
  CW = "CW",
  TF = "TF",
  GW = "GW",
  HM = "HM",
  XK = "XK",
  MS = "MS",
  NU = "NU",
  NF = "NF",
  PN = "PN",
  BL = "BL",
  SH = "SH",
  MF = "MF",
  PM = "PM",
  SX = "SX",
  GS = "GS",
  SS = "SS",
  SJ = "SJ",
  TL = "TL",
  TK = "TK",
  UM = "UM",
  WF = "WF",
  EH = "EH",
}

export enum AD_TYPE {
  ALL = "ALL",
  CREDIT_ADS = "CREDIT_ADS",
  EMPLPOYMENT_ADS = "EMPLPOYMENT_ADS",
  HOUSING_ADS = "HOUSING_ADS",
  POOLITICAL_AND_ISSUE_ADS = "POOLITICAL_AND_ISSUE_ADS",
}

export enum AD_MEDIA_TYPE {
  ALL = "ALL",
  IMAGE = "IMAGE",
  MEME = "MEME",
  VIDEO = "VIDEO",
  NONE = "NONE",
}

export enum AD_PUBLISHER_PLATFORMS {
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  AUDIENCE_NETWORK = "AUDIENCE_NETWORK",
  MESSENGER = "MESSENGER",
  WHATSAPP = "WHATSAPP",
  OCULUS = "OCULUS",
}

export enum AD_SEARCH_TYPE {
  KEYWORD_UNORDERED = "KEYWORD_UNORDERED",
  KEYWORD_EXACT_PHRASE = "KEYWORD_EXACT_PHRASE",
}

export enum AD_FIELDS {
  PAGE_ID = "page_id",
  PAGE_NAME = "page_name",
  AD_START_TIME = "ad_delivery_start_time",
  AD_URL = "ad_snapshot_url",
}

export enum AD_LANGUAGES {
  ES = "es",
  EN = "en",
}

export type BUC_ITEM = {
  type: string;
  call_count: number;
  total_cputime: number;
  total_time: number;
  estimated_time_to_regain_access: number;
};

export type BUC = {
  [key: string]: BUC_ITEM[];
};

export type MetaScrapperConfig = {
  search_terms: string;
  ad_delivery_date_min: string;
  ad_delivery_date_max: string;
  ad_reached_countries: AD_COUNTRIES[];
};

export type MetaResponseHeaders = {
  etag: string;
  "content-type": string;
  vary: string;
  "x-business-use-case-usage": string;
  "access-control-allow-origin": string;
  "facebook-api-version": string;
  "strict-transport-security": string;
  pragma: string;
  "cache-control": string;
  expires: string;
  "x-fb-request-id": string;
  "x-fb-trace-id": string;
  "x-fb-rev": string;
  "x-fb-debug": string;
  date: string;
  "x-fb-connection-quality": string;
  "alt-svc": string;
  connection: string;
  "content-length": string;
};

export type ScrapperHTMLItem = {
  iconClass: string;
  parentClass: string;
  contentClass: string;
};
