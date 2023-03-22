<script lang="ts" setup>
import { reactive, ref } from "vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import DataDict from "@/constants/dataDict"
import RegexValid from "@/constants/regexValid"
import ApiPrefix from "@/constants/apiPrefix"
import { getDetailApi, updateApi } from "@/api/common"
import { getCurrentInstance, ComponentInternalInstance } from "vue"

const userRef = ref<FormInstance | null>(null)
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const userRules = reactive<FormRules>({
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  identity: [{ required: true, message: "身份不能为空", trigger: "blur" }],
  phone: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== null) {
          if (!RegexValid.phone.test(value)) {
            callback(new Error("请输入正确的手机号"))
          }
        }
        callback()
      },
      trigger: "blur"
    }
  ]
})

const param = reactive({
  dialogVisible: false,
  user: {
    id: 0,
    name: "",
    account: "",
    identity: 0,
    sex: "",
    birthDay: "",
    phone: ""
  }
})

/** 打开弹窗 */
const open = (userId) => {
  param.dialogVisible = true
  getUserDetail(userId)
}

/** 查询用户 */
const getUserDetail = (userId: number) => {
  getDetailApi(ApiPrefix.user, { id: userId }).then((res) => {
    param.user = res.data
  })
}

/** 修改用户 */
const editUser = () => {
  userRef.value?.validate((valid: boolean) => {
    if (valid) {
      delete param.user.account
      updateApi(ApiPrefix.user, param.user).then((res) => {
        ElMessage.success(res.data)
        param.dialogVisible = false
        proxy.$emit("refresh")
      })
    }
  })
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="param.dialogVisible" :close-on-click-modal="false" title="用户修改">
    <el-card shadow="never" style="margin: 0 40px">
      <el-form ref="userRef" :model="param.user" :rules="userRules" label-width="150px">
        <el-form-item label="登录账号" prop="name">
          <el-input v-model="param.user.account" size="large" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="param.user.name" size="large" />
        </el-form-item>
        <el-form-item label="身份" prop="identity">
          <el-select v-model="param.user.identity" size="large">
            <el-option
              v-for="item in DataDict.list.identity"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="param.user.sex" size="large">
            <el-option v-for="item in DataDict.list.sex" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="param.user.birthDay" value-format="YYYY-MM-DD" type="date" size="large" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="param.user.phone" size="large" />
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="param.dialogVisible = false">取消</el-button>
        <el-button type="warning" @click="getUserDetail(param.user.id)">还原</el-button>
        <el-button type="primary" @click="editUser">修改</el-button>
      </span>
    </template>
  </el-dialog>
</template>
