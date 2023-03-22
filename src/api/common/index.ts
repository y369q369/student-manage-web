import { exportData, request } from "@/utils/service"
import { PageListResponseData } from "@/api/common/types/common"

/** 获取分页列表 */
export function getPageApi(prefix: string, params: object) {
  return request<PageListResponseData>({
    url: prefix + "/pageList",
    method: "get",
    params
  })
}

/** 获取所有数据列表 */
export function getListApi(prefix: string, params: object) {
  return request<object>({
    url: prefix + "/list",
    method: "get",
    params
  })
}

/** 获取详情 */
export function getDetailApi(prefix: string, params: object) {
  return request<object>({
    url: prefix + "/detail",
    method: "get",
    params
  })
}

/** 新增单条 */
export function addApi(prefix: string, data: object) {
  return request<object>({
    url: prefix + "/add",
    method: "post",
    data
  })
}


/** 批量新增 */
export function batchAddApi(prefix: string, dataList: Array<object>) {
  return request<string>({
    url: prefix + "/batchAdd",
    method: "post",
    data: {
      dataList
    }
  })
}

/** 修改 */
export function updateApi(prefix: string, data: object) {
  return request<string>({
    url: prefix + "/update",
    method: "put",
    data
  })
}

/** 单条删除 */
export function deleteApi(prefix: string, id: number) {
  return request<string>({
    url: prefix + "/delete",
    method: "delete",
    data: {
      id
    }
  })
}

/** 批量删除 */
export function batchDeleteApi(prefix: string, idList: Array<number>) {
  return request<object>({
    url: prefix + "/batchDelete",
    method: "delete",
    data: {
      idList
    }
  })
}

/** 导入 */
export function importUrl(prefix: string) {
  return import.meta.env.VITE_BASE_API + "/" + prefix + "/import"
}

/** 导出 */
export function exportApi(prefix: string, data: object) {
  return exportData(prefix + "/export", data)
}

/** 获取饼图统计 */
export function getPieApi(prefix: string, params: object) {
  return request<object>({
    url: prefix + "/echarts/pie",
    method: "get",
    params
  })
}
