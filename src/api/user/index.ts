import { request, exportData } from "@/utils/service"
import { PageListResponseData } from "@/api/common/types/common"

/** 批量新增 */
export function batchAddApi(userList: Array<object>) {
  return request({
    url: "user/batchAdd",
    method: "post",
    data: {
      userList: userList
    }
  })
}

/** 获取用户列表详情 */
export function getUserPageListApi(data: object) {
  return request<PageListResponseData>({
    url: "user/pageList",
    method: "get",
    params: data
  })
}

/** 获取用户 */
export function getUserDetailApi(id: number) {
  return request<object>({
    url: "user/detail",
    method: "get",
    params: {
      userId: id
    }
  })
}

/** 修改 */
export function editUserApi(user: object) {
  return request<object>({
    url: "user/update",
    method: "put",
    data: user
  })
}

/** 删除 */
export function deleteUserApi(id: number) {
  return request<string>({
    url: "user/delete",
    method: "delete",
    data: {
      userId: id
    }
  })
}

/** 重置密码 */
export function restPwdApi(id: number) {
  return request<object>({
    url: "user/restPwd",
    method: "put",
    data: {
      userId: id
    }
  })
}

/** 批量删除 */
export function batchDeleteUserApi(idList: Array<number>) {
  return request<object>({
    url: "user/batchDelete",
    method: "delete",
    data: {
      userIdList: idList
    }
  })
}

/** 导入 */
export const importUserApi = import.meta.env.VITE_BASE_API + "/user/import"

/** 导出 */
export function exportUserApi(data: object) {
  return exportData("user/export", data)
}
