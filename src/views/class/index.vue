<script lang="ts" setup>
import { ref, reactive } from "vue"
import { Search, CirclePlus, Edit, Delete, InfoFilled } from "@element-plus/icons-vue"
import ClassOperateModel from "./ClassOperateModel.vue"
import StudentChooseModel from "./StudentChooseModel.vue"
import { deleteClassApi, getClassPageListApi, getStudentPageListApi, batchDeleteStudentApi } from "@/api/class"
import { ElMessage } from "element-plus"

const classOperateRef = ref()
const studentChooseRef = ref()
const multipleSelection = ref<object[]>([])

const param = reactive({
  class: {
    name: "",
    classTeacherName: "",
    pageNo: 1,
    pageSize: 10
  },
  student: {
    classId: null,
    studentName: "",
    pageNo: 1,
    pageSize: 10
  }
})

const show = reactive({
  class: {
    tableList: [],
    total: 0
  },
  student: {
    tableList: [],
    total: 0
  }
})

/* 列表 */
const getClassPageList = () => {
  getClassPageListApi(param.class).then((res) => {
    show.class.tableList = res.data.records
    show.class.total = res.data.total
  })
}

/* 新增/修改 弹窗 */
const showDialog = (id: number | null) => {
  classOperateRef.value.open(id)
}

/* 删除 */
const deleteClass = (id: number) => {
  deleteClassApi(id).then((res) => {
    ElMessage.success(res.data)
    getClassPageList()
  })
}

/* 选择班级 */
const chooseClass = (val: object | undefined) => {
  if (val) {
    param.student.classId = val.id
    getStudentPageList()
  }
}

/* 学生列表 */
const getStudentPageList = () => {
  getStudentPageListApi(param.student).then((res) => {
    show.student.tableList = res.data.records
    show.student.total = res.data.total
    console.log(show.student)
  })
}

/* 学生选择弹窗 */
const chooseStudent = () => {
  studentChooseRef.value.open(param.student.classId)
}

/* 多选处理 */
const handleSelectionChange = (val: Array<object>) => {
  multipleSelection.value = val
}

/* batchDeleteStudent */
const batchDeleteStudent = () => {
  const studentIdList: number[] = []
  multipleSelection.value.forEach((item) => {
    studentIdList.push(item.id)
  })
  batchDeleteStudentApi(param.student.classId, studentIdList).then((res) => {
    ElMessage.success(res.data)
    getStudentPageList()
  })
}

/* 初始化 */
getClassPageList()
</script>

<template>
  <div class="app-container">
    <el-container>
      <!--  班级  -->
      <el-aside width="60%">
        <el-card shadow="always">
          <el-card shadow="never" class="search-wrapper">
            <el-form :inline="true">
              <el-form-item label="班级">
                <el-input v-model="param.class.name" />
              </el-form-item>
              <el-form-item label="班主任">
                <el-input v-model="param.class.classTeacherName" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="getClassPageList">查询</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card shadow="never">
            <div style="margin-bottom: 20px">
              <el-button type="primary" :icon="CirclePlus" @click="showDialog(null)">新增</el-button>
            </div>
            <div style="margin-bottom: 20px">
              <el-table
                :data="show.class.tableList"
                highlight-current-row
                @current-change="chooseClass"
                stripe
                style="height: calc(100vh - 405px)"
              >
                <el-table-column prop="name" label="班级" min-width="90" />
                <el-table-column prop="classTeacherName" label="班主任" min-width="90" />
                <el-table-column prop="slogan" label="标语" min-width="150" />
                <el-table-column label="操作" min-width="120">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      :icon="Edit"
                      size="small"
                      color="#626aef"
                      title="修改"
                      @click="showDialog(scope.row.id)"
                    />
                    <el-popconfirm
                      width="220"
                      confirm-button-text="确定"
                      cancel-button-text="取消"
                      :icon="InfoFilled"
                      icon-color="#626AEF"
                      @confirm="deleteClass(scope.row.id)"
                      title="确认删除吗"
                    >
                      <template #reference>
                        <el-button type="danger" :icon="Delete" size="small" title="删除" />
                      </template>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pager-wrapper">
              <el-pagination
                background
                small
                layout="total, sizes, prev, pager, next"
                :page-sizes="[10, 20, 50, 100]"
                v-model:current-page="param.class.pageNo"
                v-model:page-size="param.class.pageSize"
                :total="show.class.total"
                @size-change="getClassPageList"
                @current-change="getClassPageList"
              />
            </div>
          </el-card>
        </el-card>

        <ClassOperateModel ref="classOperateRef" @refresh="getClassPageList" />
      </el-aside>

      <!--  学生  -->
      <el-main v-show="param.student.classId" style="margin-left: 20px; padding: 0">
        <el-card shadow="always">
          <el-card shadow="never" class="search-wrapper">
            <el-form :inline="true">
              <el-form-item label="学生">
                <el-input v-model="param.student.studentName" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="getStudentPageList">查询</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card shadow="never">
            <div style="margin-bottom: 20px">
              <el-button type="primary" :icon="CirclePlus" @click="chooseStudent">管理</el-button>
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                @confirm="batchDeleteStudent"
                title="确认删除选中学生吗"
              >
                <template #reference>
                  <el-button type="danger" :icon="Delete" :disabled="multipleSelection.length === 0">
                    批量删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
            <div style="margin-bottom: 20px">
              <el-table
                :data="show.student.tableList"
                stripe
                style="height: calc(100vh - 405px)"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" />
                <el-table-column prop="name" label="学生" />
                <el-table-column prop="account" label="账号" />
              </el-table>
            </div>
            <div class="pager-wrapper">
              <el-pagination
                background
                small
                layout="total, sizes, prev, pager, next"
                :page-sizes="[10, 20, 50, 100]"
                v-model:current-page="param.student.pageNo"
                v-model:page-size="param.student.pageSize"
                :total="show.student.total"
                @size-change="getStudentPageList"
                @current-change="getStudentPageList"
              />
            </div>
          </el-card>
        </el-card>
        <StudentChooseModel ref="studentChooseRef" @refresh="getStudentPageList" style="width: 800px" />
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
</style>
