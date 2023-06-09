export interface ILoginRequestData {
  /** admin 或 editor */
  account: "admin" | "editor"
  /** 密码 */
  password: string
  /** 验证码 */
  code: string
}

export type LoginCodeResponseData = IApiResponseData<string>

export type LoginResponseData = IApiResponseData<{ token: string, user: object }>

export type UserInfoResponseData = IApiResponseData<{ username: string; roles: string[] }>
