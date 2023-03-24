import { request } from "@/utils/service"
import ApiPrefix from "@/constants/apiPrefix"

/** 重置密码 */
export function restPwdApi(id: number) {
  return request<object>({
    url: ApiPrefix.user + "/restPwd",
    method: "put",
    data: {
      id
    }
  })
}

/** 修改密码 */
export function updatePwdApi(data: object) {
  return request<object>({
    url: ApiPrefix.user + "/updatePwd",
    method: "put",
    data
  })
}
