<script lang="ts" setup>
import { reactive, ref } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage } from "element-plus"
import ApiPrefix from "@/constants/apiPrefix"
import { getDetailApi, getListApi, addApi, updateApi } from "@/api/common"
import { teacherListPrefix } from "@/api/class"
import { getCurrentInstance, ComponentInternalInstance } from "vue"

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const param = reactive({
  addFlag: true,
  dialogVisible: false
})

const show = reactive({
  data: {
    name: null,
    classTeacherId: null,
    slogan: null
  },
  teacherList: [
    {
      id: 0,
      name: ""
    }
  ]
})

const operateFormRef = ref<FormInstance>()
const operateRules = reactive<FormRules>({
  name: [{ required: true, message: "班级名称不能为空", trigger: "blur" }]
})

/** 打开弹窗 */
const open = (classId) => {
  param.dialogVisible = true
  if (classId == null) {
    param.addFlag = true
    show.data = {
      name: null,
      classTeacherId: null,
      slogan: null
    }
  } else {
    param.addFlag = false
    getDetail(classId)
  }
  getClassTeacherList(classId)
}

/** 查询 */
const getDetail = (id: number) => {
  getDetailApi(ApiPrefix.class, { classId: id }).then((res) => {
    show.data = res.data
  })
}

/** 班主任列表 */
const getClassTeacherList = (id: number) => {
  getListApi(teacherListPrefix, {
    classId: id
  }).then((res) => {
    show.teacherList = res.data
  })
}

/** 表单 */
const operate = () => {
  operateFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const fun = param.addFlag ? addApi : updateApi
      fun(ApiPrefix.class, show.data).then((res) => {
        ElMessage.success(res.data)
        param.dialogVisible = false
        proxy.$emit("refresh")
      })
    } else {
      return false
    }
  })
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="param.dialogVisible" :close-on-click-modal="false" :title="param.addFlag ? '新增' : '修改'">
    <el-card shadow="never" style="margin: 0 20px">
      <el-form ref="operateFormRef" :model="show.data" :rules="operateRules" label-width="120px">
        <el-form-item label="班级" prop="name">
          <el-input v-model.trim="show.data.name" size="large" />
        </el-form-item>
        <el-form-item label="班主任">
          <el-select v-model="show.data.classTeacherId">
            <el-option v-for="item in show.teacherList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级标语">
          <el-input v-model="show.data.slogan" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="param.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="operate">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
