import { request } from "@/utils/service"
import ApiPrefix from "@/constants/apiPrefix"

/** 班主任列表 */
export const teacherListPrefix = ApiPrefix.class + "/teacher"

/** 班级所有学生列表 */
export const studentListPrefix = ApiPrefix.classStudent + "/student"

/** 可绑定班级的额学生列表 */
export const operateStudentListPrefix = ApiPrefix.classStudent + "/operateStudent"

/** 批量处理班级-学生关系 */
export function batchOperateApi(id: number, studentIdList: Array<number>) {
  return request<object>({
    url: ApiPrefix.classStudent + "/batchOperate",
    method: "post",
    data: {
      classId: id,
      studentIdList: studentIdList
    }
  })
}
