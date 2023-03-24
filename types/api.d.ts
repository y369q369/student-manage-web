/** 所有 api 接口的响应数据都应该准守该格式 */
interface IApiResponseData<T> {
  code: number
  data: T
  message: string
}

/** 分页通用返回数据 */
interface PageListData {
  pages: number
  records: Array<object>
  total: number
}

/** 用户 */
interface User {
  id: number
  account: string
  name: string
  identity: number
  sex: number
  birthDay: string | null
  phone: string | null
}

export declare type User = User
export declare type PageListResponseData = IApiResponseData<PageListData>
