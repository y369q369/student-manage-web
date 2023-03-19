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
  }
}

const DataDict = {
  list: dataList,
  type: dataType
}

export default DataDict
