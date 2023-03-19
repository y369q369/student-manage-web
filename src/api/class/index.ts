import { request } from "@/utils/service"
import { PageListResponseData } from "@/api/common/types/common"

/** 获取班级分页列表 */
export function getClassPageListApi(data: object) {
  return request<PageListResponseData>({
    url: "class/pageList",
    method: "get",
    params: data
  })
}

/** 新增 */
export function addClassApi(data: object) {
  console.log(data)
  return request<object>({
    url: "class/add",
    method: "post",
    data: data
  })
}

/** 详情 */
export function getClassDetailApi(id: number) {
  return request<object>({
    url: "class/detail",
    method: "get",
    params: {
      classId: id
    }
  })
}

/** 修改 */
export function editClassApi(data: object) {
  return request<object>({
    url: "class/update",
    method: "put",
    data: data
  })
}

/** 删除 */
export function deleteClassApi(id: number) {
  return request<string>({
    url: "class/delete",
    method: "delete",
    params: {
      classId: id
    }
  })
}

/** 班主任列表 */
export function getClassTeacherListApi(id: number) {
  return request<object>({
    url: "class/teacherList",
    method: "get",
    params: {
      classId: id
    }
  })
}

/** 班级学生分页列表 */
export function getStudentPageListApi(data: object) {
  return request<object>({
    url: "classStudent/pageList",
    method: "get",
    params: data
  })
}

/** 班级所有学生列表 */
export function getStudentListApi(id: number) {
  return request<object>({
    url: "classStudent/list",
    method: "get",
    params: {
      classId: id
    }
  })
}

/** 可绑定班级的额学生列表 */
export function getOperateStudentListApi(id: number) {
  return request<object>({
    url: "classStudent/operateStudentList",
    method: "get",
    params: {
      classId: id
    }
  })
}

/** 批量处理班级-学生关系 */
export function batchOperateApi(id: number, studentIdList: Array<number>) {
  return request<object>({
    url: "classStudent/batchOperate",
    method: "post",
    data: {
      classId: id,
      studentIdList: studentIdList
    }
  })
}

/** 批量删除学生关系 */
export function batchDeleteStudentApi(id: number, studentIdList: Array<number>) {
  return request<object>({
    url: "classStudent/batchDelete",
    method: "delete",
    data: {
      classId: id,
      studentIdList: studentIdList
    }
  })
}
