<script lang="ts" setup>
import { ref, reactive } from "vue"
import { Search, CirclePlus, Edit, Delete, InfoFilled, RefreshLeft, Upload, Download } from "@element-plus/icons-vue"
import UserAddModel from "./UserAddModel.vue"
import UserEditModel from "./UserEditModel.vue"
import UserUploadModel from "./UserUploadModel.vue"
import DataDict from "@/constants/dataDict"
import ApiPrefix from "@/constants/apiPrefix"
import { getPageApi, deleteApi, batchDeleteApi, exportApi } from "@/api/common"
import { restPwdApi } from "@/api/user"
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
}

const addUser = () => {
  userAddRef.value.open()
}

const editUser = (userId: number) => {
  userEditRef.value.open(userId)
}

/* 列表 */
const getUserPageList = () => {
  getPageApi(ApiPrefix.user, user.query).then((res) => {
    user.tableList = res.data.records
    user.total = res.data.total
  })
}

/* 删除 */
const deleteUser = (id: number) => {
  deleteApi(ApiPrefix.user, id).then((res) => {
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
  exportApi(ApiPrefix.user, user.query).then((res) => {
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
  batchDeleteApi(ApiPrefix.user, userIdList).then((res) => {
    ElMessage.success(res.data)
    getUserPageList()
  })
}

/* 初始化 */
getUserPageList()
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true">
        <el-form-item prop="username" label="姓名">
          <el-input v-model="user.query.name" />
        </el-form-item>
        <el-form-item prop="phone" label="身份">
          <el-select v-model="user.query.identity">
            <el-option
              v-for="item in DataDict.list.identity"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="getUserPageList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <div style="margin-bottom: 20px">
        <el-button type="primary" :icon="CirclePlus" @click="addUser">新增</el-button>
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
            <el-button type="danger" :icon="Delete" :disabled="multipleSelection.length === 0"> 批量删除 </el-button>
          </template>
        </el-popconfirm>
        <el-button type="warning" :icon="Upload" @click="importUser">导入</el-button>
        <el-button color="green" :icon="Download" @click="exportUser">导出</el-button>
      </div>
      <div class="table-wrapper">
        <el-table :data="user.tableList" @selection-change="handleSelectionChange" stripe>
          <el-table-column type="selection" />
          <el-table-column prop="account" label="登录账号" />
          <el-table-column prop="name" label="姓名" />
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
          <el-table-column label="操作" width="190">
            <template #default="scope">
              <el-button :icon="Edit" color="rgb(80 218 186 / 73%)" @click="editUser(scope.row.id)" title="修改" />
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
                  <el-button type="danger" :icon="Delete" title="删除" />
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
                  <el-button color="#3c64e6b3" :icon="RefreshLeft" title="重置密码" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          style="float: right"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          v-model:current-page="user.query.pageNo"
          v-model:page-size="user.query.pageSize"
          :total="user.total"
          @size-change="getUserPageList"
          @current-change="getUserPageList"
        />
      </div>
    </el-card>

    <UserAddModel ref="userAddRef" style="min-width: 1200px; width: 80%" @refresh="getUserPageList" />
    <UserEditModel ref="userEditRef" style="width: 50%" @refresh="getUserPageList" />
    <UserUploadModel ref="userUploadRef" style="width: 500px" @refresh="getUserPageList" />
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
.el-popper.is-customized {
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}
</style>
