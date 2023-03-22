<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue"
import { Search, Edit, Delete, InfoFilled, Refresh, CirclePlus, Select, CloseBold } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import DataDict from "@/constants/dataDict"
import WorkAddModel from "./WorkAddModel.vue"
import ApiPrefix from "@/constants/apiPrefix"
import { getListApi, getPageApi, getPieApi, updateApi, batchDeleteApi } from "@/api/common"
import * as echarts from "echarts"

const workAddRef = ref()
const pieRef = ref()
const multipleSelection = ref<object[]>([])

const defaultWork = {
  studentName: "",
  classId: null,
  courseId: null,
  completionLevel: null,
  statisticsTimeSt: null,
  statisticsTimeEt: null,
  pageNo: 1,
  pageSize: 10
}

const param = reactive({
  work: { ...defaultWork },
  statisticsTime: []
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
    text: "完成情况统计",
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
  if (param.work.pageNo !== 1) {
    param.work.pageNo = 1
  }
  getWorkPageList()
  if (flag) {
    getWorkEchartsPie()
  }
}
const resetSearch = () => {
  param.work = { ...defaultWork }
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

const getWorkPageList = () => {
  if (param.statisticsTime.length > 0) {
    param.work.statisticsTimeEt = param.statisticsTime[1]
    param.work.statisticsTimeSt = param.statisticsTime[0]
  }
  getPageApi(ApiPrefix.work, param.work).then((res) => {
    show.tableList = res.data.records
    show.total = res.data.total
  })
}

const getWorkEchartsPie = () => {
  getPieApi(ApiPrefix.work, param.work).then((res) => {
    let pieData = []
    if (res.data.length > 0) {
      pieData = res.data.map((item) => {
        return {
          name: DataDict.type.work[item.id],
          value: item.value
        }
      })
    }
    pieRef.value.setOption({
      series: {
        data: pieData
      }
    })
  })
}

const updateWork = (data) => {
  updateApi(ApiPrefix.work, data).then((res) => {
    ElMessage.success(res.data)
    handleSearch(true)
  })
}

const batchDeleteWork = () => {
  const idList: number[] = []
  multipleSelection.value.forEach((item) => {
    idList.push(item.id)
  })
  batchDeleteApi(ApiPrefix.work, idList).then((res) => {
    ElMessage.success(res.data)
    getWorkPageList()
  })
}
const addWork = () => {
  workAddRef.value.open()
}

onMounted(() => {
  pieRef.value = echarts.init(document.getElementById("myChart"))
  pieRef.value.setOption(pieOption)
  getWorkEchartsPie()
})

getCourseList()
getClassList()
getWorkPageList()
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true">
        <el-form-item prop="phone" label="班级">
          <el-select v-model="param.work.classId" clearable>
            <el-option v-for="item in show.classList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="课程">
          <el-select v-model="param.work.courseId" clearable>
            <el-option v-for="item in show.courseList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="username" label="学生">
          <el-input v-model="param.work.studentName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="完成情况">
          <el-select v-model="param.work.completionLevel" clearable>
            <el-option
              v-for="item in DataDict.list.work"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              size="large"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="统计日期">
          <el-date-picker
            v-model="param.statisticsTime"
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
            <div style="margin-bottom: 20px">
              <el-button type="primary" :icon="CirclePlus" @click="addWork">新增</el-button>
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                @confirm="batchDeleteWork"
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
                <el-table-column prop="statisticsTime" label="统计日期" />
                <el-table-column label="完成情况">
                  <template #default="scope">
                    <span v-show="!scope.row.updateFlag">{{ DataDict.type.work[scope.row.completionLevel] }}</span>
                    <el-select v-show="scope.row.updateFlag" v-model="scope.row.completionLevel">
                      <el-option
                        v-for="item in DataDict.list.work"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        size="large"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <div v-show="!scope.row.updateFlag">
                      <el-button type="primary" :icon="Edit" @click="scope.row.updateFlag = true">修改</el-button>
                    </div>
                    <div v-show="scope.row.updateFlag">
                      <el-button type="success" :icon="Select" @click="updateWork(scope.row)">提交</el-button>
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
                v-model:current-page="param.work.pageNo"
                v-model:page-size="param.work.pageSize"
                :total="show.total"
                @size-change="getWorkPageList"
                @current-change="getWorkPageList"
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
    <WorkAddModel ref="workAddRef" @refresh="handleSearch(true)" style="width: 60%" />
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
