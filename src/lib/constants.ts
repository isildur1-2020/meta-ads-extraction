export type MetaApiResponse<T> = {
  data: T[];
  paging: MetaApiPaging;
};

export type AdsArchiveItem = {
  id: string;
  page_name: string;
  page_id: string;
};

export type MetaApiPaging = {
  cursors: {
    after: string;
  };
  next: string;
};
