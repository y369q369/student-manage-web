<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue"
// import { Search, Edit, Delete, InfoFilled, Refresh, CirclePlus, Select, CloseBold } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import DataDict from "@/constants/dataDict"
// import WorkAddModel from "./ExaminationAddModel.vue"
import ApiPrefix from "@/constants/apiPrefix"
import { getDetailApi } from "@/api/common"
import { updatePwdApi } from "@/api/user"
import {User} from "@/../types/api";
// import {getUserInfoApi} from "@/api/login";
// import * as echarts from "echarts"
//
// const workAddRef = ref()
// const pieRef = ref()
// const multipleSelection = ref<object[]>([])

// const param = reactive({
//   work: { ...defaultWork },
//   statisticsTime: []
// })
//
const show = reactive({
  user: <User>{},
  updateFlag: false,
  password: ""
})

const getUserInfo = () => {
  const userId = 1
  getDetailApi(ApiPrefix.user, { id: userId }).then((res) => {
    show.user = res.data
  })
}

const updatePwd = () => {
  const pwd = show.password.trim()
  if (pwd.length < 6 || pwd.length > 32) {
    ElMessage.error("密码长度需要6-32位")
  } else {
    updatePwdApi({
      id: show.user.id,
      password: show.password
    }).then((res) => {
      ElMessage.success(res.data)
      show.updateFlag = false
    })
  }
}

getUserInfo()
</script>

<template>
  <div class="app-container">
    <el-card shadow="never">
      <div class="info-wrapper">
        <div class="field">姓名</div>
        <div>{{ show.user.name }}</div>
      </div>
      <div class="info-wrapper">
        <div class="field">登录账号</div>
        <div>{{ show.user.account }}</div>
      </div>
      <div class="info-wrapper">
        <div class="field">密码</div>
        <div v-show="!show.updateFlag">
          <div class="pwd" style="display: inline-flex;">********</div>
          <el-button type="warning" @click="show.updateFlag = true">修改密码</el-button>
        </div>
        <div v-show="show.updateFlag">
          <el-input v-model="show.password" placeholder="请输入6-32位密码" class="pwd" type="password" show-password />
          <el-button type="primary" @click="updatePwd">确定修改</el-button>
          <el-button @click="show.updateFlag = false">取消</el-button>
        </div>
      </div>
      <div class="info-wrapper">
        <div class="field">身份</div>
        <div>{{ DataDict.type.identity[show.user.identity] }}</div>
      </div>
      <div class="info-wrapper">
        <div class="field">性别</div>
        <div>{{ DataDict.type.sex[show.user.sex] }}</div>
      </div>
      <div class="info-wrapper">
        <div class="field">联系方式</div>
        <div>{{ show.user.phone }}</div>
      </div>
      <div class="info-wrapper">
        <div class="field">生日</div>
        <div>{{ show.user.birthDay }}</div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.info-wrapper {
  display: flex;
  line-height: 60px;
  .field {
    width: 200px;
    margin-right: 30px;
    text-align: right;
    font-weight: bolder;
  }
  .pwd {
    width: 300px;
    margin-right: 20px;
  }
}
</style>
