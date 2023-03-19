<script lang="ts" setup>
import { ref, reactive } from "vue"
import { Search, Plus, Edit, Delete, InfoFilled } from "@element-plus/icons-vue"
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
  <div style="padding: 0 20px; height: 100%">
    <el-container style="height: 100%">
      <!--  班级  -->
      <el-aside width="50%">
        <el-row style="height: 90px; line-height: 60px; padding-top: 20px">
          <el-col :span="8" :offset="1">
            <el-row>
              <el-col :span="6" style="text-align: right">班级</el-col>
              <el-col :span="16" :offset="1">
                <el-input v-model="param.class.name" placeholder="请输入班级" size="large" />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-row>
              <el-col :span="6" style="text-align: right">班主任</el-col>
              <el-col :span="16" :offset="1">
                <el-input v-model="param.class.classTeacherName" placeholder="请输入班主任姓名" size="large" />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" :icon="Search" size="large" @click="getClassPageList">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="height: 60px">
          <el-button type="primary" :icon="Plus" plain size="large" @click="showDialog(null)">新增</el-button>
        </el-row>
        <el-row style="height: calc(100% - 190px)">
          <el-col style="height: calc(100% - 80px)">
            <el-table
              :data="show.class.tableList"
              highlight-current-row
              @current-change="chooseClass"
              stripe
              style="height: 100%"
            >
              <el-table-column type="index" />
              <el-table-column prop="name" label="班级" />
              <el-table-column prop="classTeacherName" label="班主任" />
              <el-table-column prop="slogan" label="标语" />
              <el-table-column label="操作">
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
          </el-col>
          <el-col style="width: 100%; padding-top: 20px; height: 90px">
            <el-pagination
              background
              layout="sizes, prev, pager, next"
              :page-sizes="[10, 20, 50, 100]"
              v-model:current-page="param.class.pageNo"
              v-model:page-size="param.class.pageSize"
              :total="show.class.total"
              @size-change="getClassPageList"
              @current-change="getClassPageList"
            />
          </el-col>
        </el-row>
        <ClassOperateModel ref="classOperateRef" @refresh="getClassPageList" />
      </el-aside>
      <!--  学生  -->
      <el-main v-show="param.student.classId" style="padding-left: 80px">
        <el-row style="height: 90px; line-height: 60px">
          <el-col :span="8" :offset="1">
            <el-row>
              <el-col :span="6" style="text-align: right">学生</el-col>
              <el-col :span="16" :offset="1">
                <el-input v-model="param.student.studentName" size="large" />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" :icon="Search" size="large" @click="getStudentPageList">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="height: 60px">
          <el-button type="primary" :icon="Plus" plain size="large" @click="chooseStudent">选择</el-button>
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
              <el-button type="danger" :icon="Delete" plain size="large" :disabled="multipleSelection.length === 0">
                批量删除
              </el-button>
            </template>
          </el-popconfirm>
        </el-row>
        <el-row style="height: calc(100% - 190px)">
          <el-col style="height: calc(100% - 80px)">
            <el-table
              :data="show.student.tableList"
              stripe
              style="height: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" />
              <el-table-column prop="name" label="学生" />
              <el-table-column prop="account" label="账号" />
            </el-table>
          </el-col>
          <el-col style="width: 100%; padding-top: 20px; height: 90px">
            <el-pagination
              background
              layout="sizes, prev, pager, next"
              :page-sizes="[10, 20, 50, 100]"
              v-model:current-page="param.student.pageNo"
              v-model:page-size="param.student.pageSize"
              :total="show.student.total"
              @size-change="getStudentPageList"
              @current-change="getStudentPageList"
            />
          </el-col>
        </el-row>
        <StudentChooseModel ref="studentChooseRef" @refresh="getStudentPageList" style="width: 700px" />
      </el-main>
    </el-container>
  </div>
</template>
