<script lang="ts" setup>
import { reactive } from "vue"
import { ElMessage } from "element-plus"
import DataDict from "@/constants/dataDict"
import ApiPrefix from "@/constants/apiPrefix"
import { getListApi, batchAddApi } from "@/api/common"
import { studentListPrefix } from "@/api/class"
import { getCurrentInstance, ComponentInternalInstance } from "vue"
import dayjs from "dayjs"

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const param = reactive({
  dialogVisible: false,
  classList: [],
  studentName: ""
})

const show = reactive({
  courseList: [
    {
      id: null,
      name: ""
    }
  ],
  classList: [
    {
      id: null,
      name: ""
    }
  ],
  courseId: null,
  classId: 1,
  statisticsTime: null,
  studentList: [],
  allTableList: [],
  filterTableList: []
})

/** 打开弹窗 */
const open = () => {
  param.dialogVisible = true
  if (show.statisticsTime == null) {
    show.statisticsTime = dayjs(new Date()).format("YYYY-MM-DD")
  }
  if (show.courseList.length == 1 && show.courseList[0].id == null) {
    getCourseList()
  }
  if (show.classList.length == 1 && show.classList[0].id == null) {
    getClassList()
  }
}

/** 获取班级列表 */
const getClassList = () => {
  getListApi(ApiPrefix.class).then((res) => {
    show.classList = res.data
    if (res.data.length > 0) {
      show.classId = res.data[0].id
      getStudentList()
    } else {
      show.classId = null
    }
  })
}

/** 课程列表 */
const getCourseList = () => {
  getListApi(ApiPrefix.course).then((res) => {
    show.courseList = res.data
    if (res.data.length > 0) {
      show.courseId = res.data[0].id
    }
  })
}

/** 班级下所有学生 */
const getStudentList = () => {
  getListApi(studentListPrefix, {
    classId: show.classId
  }).then((res) => {
    show.studentList = res.data
    show.allTableList = []
    if (res.data.length > 0) {
      res.data.forEach((item) => {
        show.allTableList.push({
          studentId: item.id,
          studentName: item.name,
          completionLevel: 0
        })
      })
      filterTableData()
    }
  })
}

/** 表格过滤数据 */
const filterTableData = () => {
  if (param.studentName != "") {
    show.filterTableList = show.allTableList.filter((item) => {
      return item.studentName.indexOf(param.studentName) > -1
    })
  } else {
    show.filterTableList = show.allTableList
  }
}

/** 批量新增用户 */
const batchAdd = () => {
  if (show.allTableList.length == 0) {
    ElMessage.error("新增数据为空")
  } else {
    show.allTableList.forEach((item) => {
      item.statisticsTime = show.statisticsTime
      item.courseId = show.courseId
      item.classId = show.classId
    })
    batchAddApi(ApiPrefix.work, show.allTableList).then((res) => {
      ElMessage.success(res.data)
      param.dialogVisible = false
      proxy.$emit("refresh")
    })
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="param.dialogVisible"
    title="作业完成情况新增"
    :close-on-click-modal="false"
    top="5vh"
    style="height: 90vh"
  >
    <el-card class="search-wrapper">
      <el-form :inline="true">
        <el-form-item prop="username" label="班级">
          <el-select v-model="show.classId" @change="getStudentList">
            <el-option v-for="item in show.classList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="username" label="课程">
          <el-select v-model="show.courseId">
            <el-option v-for="item in show.courseList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="统计日期">
          <el-date-picker v-model="show.statisticsTime" :clearable="false" value-format="YYYY-MM-DD" type="date" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="body-wrapper">
      <el-form :inline="true">
        <el-form-item prop="username" label="学生">
          <el-input v-model="param.studentName" :clearable="true" @change="filterTableData" />
        </el-form-item>
      </el-form>

      <div>
        <el-table :data="show.filterTableList" stripe style="width: 100%; height: calc(90vh - 360px)">
          <el-table-column type="index" />
          <el-table-column prop="studentName" label="学生" />
          <el-table-column label="完成情况">
            <template #default="scope">
              <el-select v-model="scope.row.completionLevel">
                <el-option
                  v-for="item in DataDict.list.work"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="param.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="batchAdd">新增</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.body-wrapper {
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
</style>
