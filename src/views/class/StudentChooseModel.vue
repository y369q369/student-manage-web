<script lang="ts" setup>
import { reactive, ref } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage } from "element-plus"
import { getStudentListApi, getOperateStudentListApi, batchOperateApi } from "@/api/class"
import { getCurrentInstance, ComponentInternalInstance } from "vue"

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const param = reactive({
  dialogVisible: false,
  classId: null
})

const show = reactive({
  classStudentIdList: [],
  operateStudentList: []
})

/** 打开弹窗 */
const open = (classId) => {
  param.dialogVisible = true
  param.classId = classId
  getStudentList()
  getOperateStudentList()
}

/** 班级内学生列表 */
const getStudentList = () => {
  getStudentListApi(param.classId).then((res) => {
    res.data.forEach((item) => {
      show.classStudentIdList.push(item.id)
    })
  })
}

/** 可操作学生列表 */
const getOperateStudentList = () => {
  getOperateStudentListApi(param.classId).then((res) => {
    show.operateStudentList = res.data
  })
}

/** 过滤 */
const filterMethod = (query, item) => {
  return item.name.search(query) != -1
}

/** 批量处理 */
const batchChoose = () => {
  batchOperateApi(param.classId, show.classStudentIdList).then((res) => {
    ElMessage.success(res.data)
    param.dialogVisible = false
    proxy.$emit("refresh")
  })
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="param.dialogVisible" title="学生选择" max>
    <el-transfer
      style="padding: 20px 40px"
      v-model="show.classStudentIdList"
      :titles="['所有学生', '选中学生']"
      :props="{
        key: 'id',
        label: 'name'
      }"
      filterable
      :filter-method="filterMethod"
      :data="show.operateStudentList"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="param.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="batchChoose">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
