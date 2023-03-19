<script lang="ts" setup>
import { reactive } from "vue"
import { ElMessage } from "element-plus"
import DataDict from "@/constants/dataDict"
import { getUserDetailApi, editUserApi } from "@/api/user"
import { getCurrentInstance, ComponentInternalInstance } from "vue"

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const param = reactive({
  dialogVisible: false,
  user: {
    id: "",
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
  getUserDetailApi(userId).then((res) => {
    console.log(res)
    param.user = res.data
  })
}

/** 修改用户 */
const editUser = () => {
  console.log(param.user)
  delete param.user.account
  editUserApi(param.user).then((res) => {
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
  <el-dialog v-model="param.dialogVisible" title="用户修改" max>
    <el-row style="line-height: 40px">
      <el-col :span="20" :offset="1" style="margin-bottom: 20px">
        <el-row>
          <el-col :span="6" style="text-align: right"><strong>姓名</strong></el-col>
          <el-col :span="16" :offset="1">
            <el-input v-model="param.user.name" size="large" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="20" :offset="1" style="margin-bottom: 20px">
        <el-row>
          <el-col :span="6" style="text-align: right"><strong>登录账号</strong></el-col>
          <el-col :span="16" :offset="1">
            <el-input v-model="param.user.account" size="large" disabled />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="20" :offset="1" style="margin-bottom: 20px">
        <el-row>
          <el-col :span="6" style="text-align: right"><strong>身份</strong></el-col>
          <el-col :span="16" :offset="1">
            <el-select v-model="param.user.identity">
              <el-option v-for="item in DataDict.identity" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="20" :offset="1" style="margin-bottom: 20px">
        <el-row>
          <el-col :span="6" style="text-align: right"><strong>性别</strong></el-col>
          <el-col :span="16" :offset="1">
            <el-select v-model="param.user.sex">
              <el-option v-for="item in DataDict.sex" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="20" :offset="1" style="margin-bottom: 20px">
        <el-row>
          <el-col :span="6" style="text-align: right"><strong>生日</strong></el-col>
          <el-col :span="16" :offset="1">
            <el-date-picker v-model="param.user.birthDay" value-format="YYYY-MM-DD" type="date" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="20" :offset="1" style="margin-bottom: 20px">
        <el-row>
          <el-col :span="6" style="text-align: right"><strong>联系方式</strong></el-col>
          <el-col :span="16" :offset="1">
            <el-input v-model="param.user.phone" size="large" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="param.dialogVisible = false">取消</el-button>
        <el-button type="warning" @click="getUserDetail(param.user.id)">还原</el-button>
        <el-button type="primary" @click="editUser">修改</el-button>
      </span>
    </template>
  </el-dialog>
</template>
