import { request, exportData } from "@/utils/service"
import { PageListResponseData } from "@/api/common/types/common"

/** 批量新增 */
export function batchAddApi(userList: Array<object>) {
  return request({
    url: "work/batchAdd",
    method: "post",
    data: {
      workList: userList
    }
  })
}

/** 获取分页列表 */
export function getWorkPageListApi(data: object) {
  return request<PageListResponseData>({
    url: "work/pageList",
    method: "get",
    params: data
  })
}

/** 修改 */
export function editWorkApi(data: object) {
  return request<object>({
    url: "work/update",
    method: "put",
    data
  })
}

/** 批量删除 */
export function batchDeleteWorkApi(idList: Array<number>) {
  return request<object>({
    url: "work/batchDelete",
    method: "delete",
    data: {
      workIdList: idList
    }
  })
}
