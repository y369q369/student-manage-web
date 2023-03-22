<script lang="ts" setup>
import { reactive } from "vue"
import { ElMessage } from "element-plus"
import { getListApi } from "@/api/common"
import { studentListPrefix, operateStudentListPrefix, batchOperateApi } from "@/api/class"
import { getCurrentInstance, ComponentInternalInstance } from "vue"

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const param = reactive({
  dialogVisible: false,
  classId: null,
  submitFlag: false
})

const show = reactive({
  classStudentIdList: [],
  operateStudentList: []
})

/** 打开弹窗 */
const open = (classId) => {
  param.dialogVisible = true
  param.classId = classId
  param.submitFlag = false
  getStudentList()
  getOperateStudentList()
}

/** 班级内已绑定学生列表 */
const getStudentList = () => {
  show.classStudentIdList = []
  getListApi(studentListPrefix, { classId: param.classId }).then((res) => {
    res.data.forEach((item) => {
      show.classStudentIdList.push(item.id)
    })
  })
}

/** 所有可操作学生列表 */
const getOperateStudentList = () => {
  show.operateStudentList = []
  getListApi(operateStudentListPrefix, { classId: param.classId }).then((res) => {
    show.operateStudentList = res.data
  })
}

/** 过滤 */
const filterMethod = (query, item) => {
  return item.name.search(query) != -1
}

/** 批量处理 */
const batchChoose = () => {
  param.submitFlag = true
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
  <el-dialog v-model="param.dialogVisible" :close-on-click-modal="false" top="5vh" title="班级管理">
    <el-card style="margin: 0 40px">
      <el-transfer
        style=""
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
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="param.dialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="param.submitFlag" @click="batchChoose">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-transfer {
  padding: 20px 30px;
  :deep(.el-transfer-panel) {
    width: 300px;
  }
  :deep(.el-transfer-panel__body) {
    height: calc(90vh - 300px);
  }
  :deep(.el-transfer-panel__body) {
    width: 250px;
  }
}
</style>
