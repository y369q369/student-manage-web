<script lang="ts" setup>
import { reactive, ref } from "vue"
import { Upload } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import { importUserApi } from "@/api/user"
import { getCurrentInstance, ComponentInternalInstance } from "vue"
import { genFileId } from "element-plus"
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus"

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const upload = ref<UploadInstance>()

const param = reactive({
  dialogVisible: false
})

/** 打开弹窗 */
const open = () => {
  param.dialogVisible = true
}

/** 文件超出限制 */
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

/** 上传 */
const submitUpload = () => {
  upload.value!.submit()
}

/** 失败操作操作 */
const handleError = (error: Error) => {
  ElMessage.error(error.message)
}

/** 成功操作 */
const handleSuccess = (response: any) => {
  if (response.code === 0) {
    ElMessage.success(response.data)
    proxy.$emit("refresh")
  } else {
    ElMessage.error(response.message)
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="param.dialogVisible" title="用户导入">
    <el-card shadow="never">
      <el-upload
        ref="upload"
        :action="importUserApi"
        :limit="1"
        :auto-upload="false"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
        :on-error="handleError"
        style="padding: 0 50px"
      >
        <el-button type="warning" :icon="Upload" size="large">文件选择</el-button>
      </el-upload>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="param.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload">导入</el-button>
      </span>
    </template>
  </el-dialog>
</template>
