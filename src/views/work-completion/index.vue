<script lang="ts" setup>
import { reactive } from "vue"

const completionLevelList = [
  {
    label: "全部完成",
    value: 0
  },
  {
    label: "完成较好",
    value: 1
  },
  {
    label: "完成较差",
    value: 2
  },
  {
    label: "未完成",
    value: 3
  }
]

const userQuery = reactive({
  userName: "admin",
  completionLevel: 1,
  statisticsTime: [],
  pageNo: 1,
  pageSize: 10
})
</script>

<template>
  <div>
    <div style="height: 20px"></div>
    <el-row style="height: 60px; line-height: 60px">
      <el-col :span="5" :offset="1">
        <el-row>
          <el-col :span="6" style="text-align: right">学生</el-col>
          <el-col :span="16" :offset="1">
            <el-input v-model="userQuery.completionLevel" placeholder="用户名" size="large" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="5">
        <el-row>
          <el-col :span="6" style="text-align: right">完成情况</el-col>
          <el-col :span="16" :offset="1">
            <el-select v-model="userQuery.completionLevel" class="m-2" placeholder="Select" size="large">
              <el-option
                v-for="item in completionLevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                size="large"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="10">
        <el-row>
          <el-col :span="3" style="text-align: right">统计日期</el-col>
          <el-col :span="16" :offset="1">
            <el-date-picker
              v-model="userQuery.statisticsTime"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              size="large"
            />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="large">查询</el-button>
      </el-col>
    </el-row>
    <div style="height: 15px"></div>
    <el-row>
      <el-col :span="22" :offset="1">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
