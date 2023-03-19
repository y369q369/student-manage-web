<script lang="ts" setup>
import { ref, reactive } from "vue"
import { Search, Plus, Edit, Delete, InfoFilled, RefreshLeft, Upload, Download } from "@element-plus/icons-vue"
import UserAddModel from "./UserAddModel.vue"
import UserEditModel from "./UserEditModel.vue"
import UserUploadModel from "./UserUploadModel.vue"
import DataDict from "@/constants/dataDict"
import { getUserPageListApi, deleteUserApi, restPwdApi, batchDeleteUserApi, exportUserApi } from "@/api/user"
import { ElMessage } from "element-plus"

const userAddRef = ref()
const userEditRef = ref()
const userUploadRef = ref()
const multipleSelection = ref<object[]>([])

const user = reactive({
  query: {
    name: "",
    identity: "",
    pageNo: 1,
    pageSize: 10
  },
  tableList: [],
  total: 0
})

const handleSelectionChange = (val: Array<object>) => {
  multipleSelection.value = val
  console.log(multipleSelection.value)
}

const addUser = () => {
  userAddRef.value.open()
}

const editUser = (userId: number) => {
  userEditRef.value.open(userId)
}

/* 列表 */
const getUserPageList = () => {
  getUserPageListApi(user.query).then((res) => {
    user.tableList = res.data.records
    user.total = res.data.total
  })
}

/* 删除 */
const deleteUser = (id: number) => {
  deleteUserApi(id).then((res) => {
    console.log(res)
    ElMessage.success(res.data)
    getUserPageList()
  })
}

/* 导入 */
const importUser = () => {
  userUploadRef.value.open()
}

/* 导出 */
const exportUser = () => {
  exportUserApi(user.query).then((res) => {
    if (res.status == 200) {
      ElMessage.success("导出成功")
    } else {
      ElMessage.error("导出失败")
    }
  })
}

/* 重置密码 */
const resetPwd = (id: number) => {
  restPwdApi(id).then((res) => {
    ElMessage.success(res.data)
  })
}

/* 批量删除 */
const batchDeleteUser = () => {
  const userIdList: number[] = []
  multipleSelection.value.forEach((item) => {
    userIdList.push(item.id)
  })
  batchDeleteUserApi(userIdList).then((res) => {
    ElMessage.success(res.data)
    getUserPageList()
  })
}

/* 初始化 */
getUserPageList()
</script>

<template>
  <div style="padding: 0 20px; height: 100%">
    <el-row style="height: 90px; line-height: 60px; padding-top: 20px">
      <el-col :span="5" :offset="1">
        <el-row>
          <el-col :span="6" style="text-align: right">姓名</el-col>
          <el-col :span="16" :offset="1">
            <el-input v-model="user.query.name" placeholder="请输入姓名" size="large" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="5">
        <el-row>
          <el-col :span="6" style="text-align: right">身份</el-col>
          <el-col :span="16" :offset="1">
            <el-select v-model="user.query.identity" class="m-2" placeholder="请选择身份" size="large">
              <el-option
                v-for="item in DataDict.list.identity"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                size="large"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" :icon="Search" size="large" @click="getUserPageList">查询</el-button>
      </el-col>
    </el-row>
    <el-row style="height: 60px">
      <el-button type="primary" :icon="Plus" plain size="large" @click="addUser">新增</el-button>
      <el-popconfirm
        width="220"
        confirm-button-text="确定"
        cancel-button-text="取消"
        :icon="InfoFilled"
        icon-color="#626AEF"
        @confirm="batchDeleteUser"
        title="确认删除选中用户吗"
      >
        <template #reference>
          <el-button type="danger" :icon="Delete" plain size="large" :disabled="multipleSelection.length === 0">
            批量删除
          </el-button>
        </template>
      </el-popconfirm>
      <el-button type="warning" :icon="Upload" plain size="large" @click="importUser">导入</el-button>
      <el-button color="green" :icon="Download" plain size="large" @click="exportUser">导出</el-button>
    </el-row>
    <el-row style="height: calc(100% - 190px)">
      <el-col style="height: calc(100% - 80px)">
        <el-table :data="user.tableList" @selection-change="handleSelectionChange" stripe style="height: 100%">
          <el-table-column type="selection" />
          <el-table-column type="index" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="account" label="登录账号" />
          <el-table-column label="身份">
            <template #default="scope">
              <span>{{ DataDict.type.identity[scope.row.identity] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别">
            <template #default="scope">
              <span>{{ DataDict.type.sex[scope.row.sex] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="birthDay" label="生日" />
          <el-table-column prop="phone" label="联系方式" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                :icon="Edit"
                size="small"
                color="#626aef"
                title="修改"
                @click="editUser(scope.row.id)"
              />
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                @confirm="deleteUser(scope.row.id)"
                title="确认删除用户吗"
              >
                <template #reference>
                  <el-button type="danger" :icon="Delete" size="small" title="删除" />
                </template>
              </el-popconfirm>
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                @confirm="resetPwd(scope.row.id)"
                title="确认重置密码吗"
              >
                <template #reference>
                  <el-button type="danger" :icon="RefreshLeft" size="small" title="重置密码" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col style="width: 100%; padding-top: 20px; height: 40px">
        <el-pagination
          style="float: right"
          background
          layout="sizes, prev, pager, next"
          :page-sizes="[10, 20, 50, 100]"
          v-model:current-page="user.query.pageNo"
          v-model:page-size="user.query.pageSize"
          :total="user.total"
          @size-change="getUserPageList"
          @current-change="getUserPageList"
        />
      </el-col>
    </el-row>
    <UserAddModel ref="userAddRef" style="width: 1400px; height: 580px" @refresh="getUserPageList" />
    <UserEditModel ref="userEditRef" style="width: 1400px; height: 580px" @refresh="getUserPageList" />
    <UserUploadModel ref="userUploadRef" style="width: 500px" @refresh="getUserPageList" />
  </div>
</template>
