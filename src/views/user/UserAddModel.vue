<script lang="ts" setup>
import { reactive } from "vue"
import { Plus, Delete, ArrowUp, ArrowDown } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import DataDict from "@/constants/dataDict"
import ApiPrefix from "@/constants/apiPrefix"
import { batchAddApi } from "@/api/common"
import { getCurrentInstance, ComponentInternalInstance } from "vue"

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const defaultUser = {
  name: "",
  account: "",
  identity: 0,
  sex: 0,
  birthDay: "",
  phone: ""
}

const param = reactive({
  dialogVisible: false,
  list: [{ ...defaultUser }]
})

/** 打开弹窗 */
const open = () => {
  param.dialogVisible = true
}

/** 新增行 */
const addLine = () => {
  param.list.push({ ...defaultUser })
}

/** 删除行 */
const deleteLine = (index: number) => {
  param.list.splice(index, 1)
}

/** 上移行 */
const moveUpLine = (index: number) => {
  const temp: object = param.list[index]
  param.list[index] = param.list[index - 1]
  param.list[index - 1] = temp
}

/** 下移行 */
const moveDownLine = (index: number) => {
  const temp: object = param.list[index]
  param.list[index] = param.list[index + 1]
  param.list[index + 1] = temp
}

/** 批量新增用户 */
const batchAddUser = () => {
  if (param.list.length == 0) {
    ElMessage.error("没有可添加用户")
  } else {
    const errorIndexArr = []
    for (let i = 0; i < param.list.length; i++) {
      const item = param.list[i]
      if (item.name == "" || item.account == "") {
        errorIndexArr.push(i + 1)
      }
    }
    if (errorIndexArr.length > 0) {
      ElMessage.error("第" + errorIndexArr + "项 用户名/登录账号 为空")
    } else {
      batchAddApi(ApiPrefix.user, param.list).then((res) => {
        ElMessage.success(res.data)
        param.dialogVisible = false
        param.list = [{ ...defaultUser }]
        proxy.$emit("refresh")
      })
    }
  }
}

const reset = () => {
  param.list = [{ ...defaultUser }]
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="param.dialogVisible" :close-on-click-modal="false" title="用户新增" top="10vh">
    <el-card shadow="never" style="margin: 0 20px">
      <el-table :data="param.list" stripe style="width: 100%; height: calc(80vh - 200px)">
        <el-table-column type="index" />
        <el-table-column label="登录账号" min-width="150">
          <template #default="scope">
            <el-input v-model="scope.row.account" />
          </template>
        </el-table-column>
        <el-table-column label="用户名" min-width="150">
          <template #default="scope">
            <el-input v-model="scope.row.name" />
          </template>
        </el-table-column>
        <el-table-column label="身份" min-width="120">
          <template #default="scope">
            <el-select v-model="scope.row.identity">
              <el-option
                v-for="item in DataDict.list.identity"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="性别" min-width="120">
          <template #default="scope">
            <el-select v-model="scope.row.sex">
              <el-option v-for="item in DataDict.list.sex" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="生日" width="180">
          <template #default="scope">
            <el-date-picker style="width: 150px" v-model="scope.row.birthDay" value-format="YYYY-MM-DD" type="date" />
          </template>
        </el-table-column>
        <el-table-column label="联系方式" min-width="150">
          <template #default="scope">
            <el-input v-model="scope.row.phone" />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="210">
          <template #default="scope">
            <el-button type="primary" :icon="Plus" size="small" title="新增一行" @click="addLine" />
            <el-button type="danger" :icon="Delete" size="small" title="删除当前行" @click="deleteLine(scope.$index)" />
            <el-button
              type="success"
              :icon="ArrowUp"
              size="small"
              title="上移"
              @click="moveUpLine(scope.$index)"
              v-show="scope.$index > 0"
            />
            <el-button
              type="info"
              :icon="ArrowDown"
              size="small"
              title="下移"
              @click="moveDownLine(scope.$index)"
              v-show="scope.$index < param.list.length - 1"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="param.dialogVisible = false">取消</el-button>
        <el-button type="warning" @click="reset">重置</el-button>
        <el-button type="primary" @click="batchAddUser">新增</el-button>
      </span>
    </template>
  </el-dialog>
</template>
