export interface PageListData {
  pages: number
  records: Array<object>
  total: number
}

export type PageListResponseData = IApiResponseData<PageListData>
