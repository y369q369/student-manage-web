import { request, exportData } from "@/utils/service"
import { PageListResponseData } from "@/api/common/types/common"
import ApiPrefix from "@/constants/apiPrefix"

/** 获取用户列表详情 */
export function getUserPageListApi(data: object) {
  return request<PageListResponseData>({
    url: ApiPrefix.user + "/pageList",
    method: "get",
    params: data
  })
}

/** 重置密码 */
export function restPwdApi(id: number) {
  return request<object>({
    url: ApiPrefix.user + "/restPwd",
    method: "put",
    data: {
      id: id
    }
  })
}

/** 导入 */
export const importUserApi = import.meta.env.VITE_BASE_API + "/user/import"

/** 导出 */
export function exportUserApi(data: object) {
  return exportData("user/export", data)
}
