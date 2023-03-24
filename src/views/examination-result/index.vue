<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue"
import { Search, Edit, Delete, InfoFilled, Refresh, CirclePlus, Select, CloseBold } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import DataDict from "@/constants/dataDict"
import WorkAddModel from "./ExaminationAddModel.vue"
import ApiPrefix from "@/constants/apiPrefix"
import { getListApi, getPageApi, getPieApi, updateApi, batchDeleteApi } from "@/api/common"
import * as echarts from "echarts"

const addRef = ref()
const pieRef = ref()
const multipleSelection = ref<object[]>([])

const defaultExamination = {
  studentName: "",
  classId: null,
  courseId: null,
  operateSymbolMark: null,
  typeList: "",
  score: null,
  examinationTimeSt: null,
  examinationTimeEt: null,
  pageNo: 1,
  pageSize: 10
}

const param = reactive({
  examinationResult: { ...defaultExamination },
  examinationTime: [],
  typeList: []
})

const show = reactive({
  courseList: [
    {
      id: 0,
      name: ""
    }
  ],
  classList: [
    {
      id: 0,
      name: ""
    }
  ],
  tableList: [],
  total: 0
})

const pieOption = {
  title: {
    text: "成绩分布统计",
    left: "center"
  },
  tooltip: {
    trigger: "item"
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "50%",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
}

const handleSelectionChange = (val: Array<object>) => {
  multipleSelection.value = val
}

const handleSearch = (flag: boolean) => {
  if (param.examinationResult.pageNo !== 1) {
    param.examinationResult.pageNo = 1
  }
  getPageList()
  if (flag) {
    getEchartsPie()
  }
}
const resetSearch = () => {
  param.examinationResult = { ...defaultExamination }
  param.statisticsTime = []
}

const getCourseList = () => {
  getListApi(ApiPrefix.course).then((res) => {
    show.courseList = res.data
  })
}

const getClassList = () => {
  getListApi(ApiPrefix.class).then((res) => {
    show.classList = res.data
    if (res.data.length > 0) {
      show.classId = res.data[0].id
    } else {
      show.classId = null
    }
  })
}

const getPageList = () => {
  if (param.examinationTime.length > 0) {
    param.examinationResult.examinationTimeSt = param.examinationTime[0]
    param.examinationResult.examinationTimeEt = param.examinationTime[1]
  }
  if (param.typeList.length > 0) {
    param.examinationResult.typeList = param.typeList.join()
  }
  getPageApi(ApiPrefix.examinationResult, param.examinationResult).then((res) => {
    show.tableList = res.data.records
    show.total = res.data.total
  })
}

const getEchartsPie = () => {
  getPieApi(ApiPrefix.examinationResult, param.examinationResult).then((res) => {
    pieRef.value.setOption({
      series: {
        data: res.data
      }
    })
  })
}

const update = (data) => {
  updateApi(ApiPrefix.examinationResult, data).then((res) => {
    ElMessage.success(res.data)
    handleSearch(true)
  })
}

const batchDelete = () => {
  const idList: number[] = []
  multipleSelection.value.forEach((item) => {
    idList.push(item.id)
  })
  batchDeleteApi(ApiPrefix.examinationResult, idList).then((res) => {
    ElMessage.success(res.data)
    getPageList()
  })
}
const addWork = () => {
  addRef.value.open()
}

onMounted(() => {
  pieRef.value = echarts.init(document.getElementById("myChart"))
  pieRef.value.setOption(pieOption)
  getEchartsPie()
})

getCourseList()
getClassList()
getPageList()
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true">
        <el-form-item prop="phone" label="班级">
          <el-select v-model="param.examinationResult.classId" clearable>
            <el-option v-for="item in show.classList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="课程">
          <el-select v-model="param.examinationResult.courseId" clearable>
            <el-option v-for="item in show.courseList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="param.typeList" multiple collapse-tags collapse-tags-tooltip>
            <el-option
              v-for="item in DataDict.list.examinationType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="成绩">
          <el-select v-model="param.examinationResult.operateSymbolMark" clearable style="width: 90px">
            <el-option
              v-for="item in DataDict.list.operationSymbol"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="param.examinationResult.score" style="width: 120px; margin-left: 5px" />
        </el-form-item>
        <el-form-item prop="username" label="学生">
          <el-input v-model="param.examinationResult.studentName" />
        </el-form-item>
        <el-form-item prop="phone" label="考试日期">
          <el-date-picker
            v-model="param.examinationTime"
            type="daterange"
            range-separator="~"
            style="width: 250px"
            value-format="YYYY-MM-DD"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-container>
        <el-aside width="calc(100% - 400px)">
          <el-card shadow="never">
            <div style="margin-bottom: 20px" v-permission="['admin']">
              <el-button type="primary" :icon="CirclePlus" @click="addWork">新增</el-button>
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                @confirm="batchDelete"
                title="确认删除选中记录吗"
              >
                <template #reference>
                  <el-button type="danger" :icon="Delete" :disabled="multipleSelection.length === 0">
                    批量删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
            <div class="table-wrapper">
              <el-table :data="show.tableList" @selection-change="handleSelectionChange" stripe style="width: 100%">
                <el-table-column type="selection" />
                <el-table-column prop="className" label="班级" />
                <el-table-column prop="courseName" label="课程" />
                <el-table-column prop="studentName" label="学生" />
                <el-table-column prop="examinationTime" label="考试日期" />
                <el-table-column label="类型">
                  <template #default="scope">
                    {{ DataDict.type.examinationType[scope.row.type] }}
                  </template>
                </el-table-column>
                <el-table-column label="分数">
                  <template #default="scope">
                    <span v-show="!scope.row.updateFlag">{{ scope.row.score }}</span>
                    <el-input v-show="scope.row.updateFlag" v-model="scope.row.score" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                  <template #default="scope">
                    <div v-show="!scope.row.updateFlag">
                      <el-button type="primary" :icon="Edit" @click="scope.row.updateFlag = true">修改</el-button>
                    </div>
                    <div v-show="scope.row.updateFlag">
                      <el-button type="success" :icon="Select" @click="update(scope.row)">提交</el-button>
                      <el-button :icon="CloseBold" @click="scope.row.updateFlag = false">取消</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pager-wrapper">
              <el-pagination
                style="float: right"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :hide-on-single-page="false"
                :pager-count="5"
                :page-sizes="[10, 20, 50, 100]"
                v-model:current-page="param.examinationResult.pageNo"
                v-model:page-size="param.examinationResult.pageSize"
                :total="show.total"
                @size-change="getPageList"
                @current-change="getPageList"
              />
            </div>
          </el-card>
        </el-aside>
        <el-main style="margin-left: 20px; padding: 0">
          <el-card shadow="never">
            <div id="myChart" style="width: 350px; height: 350px" />
          </el-card>
        </el-main>
      </el-container>
    </el-card>
    <WorkAddModel ref="addRef" @refresh="handleSearch(true)" style="width: 60%" />
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
  .el-select {
    width: 160px;
  }
}
</style>
