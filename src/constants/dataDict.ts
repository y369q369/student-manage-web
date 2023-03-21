const dataList = {
  identity: [
    {
      label: "教师",
      value: 1
    },
    {
      label: "学生",
      value: 0
    }
  ],
  sex: [
    {
      label: "女",
      value: 0
    },
    {
      label: "男",
      value: 1
    }
  ],
  work: [
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
}

const dataType = {
  identity: {
    0: "学生",
    1: "教师"
  },
  sex: {
    0: "女",
    1: "男"
  },
  work: {
    0: "全部完成",
    1: "完成较好",
    2: "完成较差",
    3: "未完成"
  }
}

const DataDict = {
  list: dataList,
  type: dataType
}

export default DataDict
