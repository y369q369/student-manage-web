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
  ],
  operationSymbol: [
    {
      label: ">",
      value: 0
    },
    {
      label: ">=",
      value: 1
    },
    {
      label: "=",
      value: 2
    },
    {
      label: "<=",
      value: 3
    },
    {
      label: "<",
      value: 4
    },
    {
      label: "!=",
      value: 5
    }
  ],
  examinationType: [
    {
      label: "期中考试",
      value: 0
    },
    {
      label: "期末考试",
      value: 1
    },
    {
      label: "月考",
      value: 2
    },
    {
      label: "周考",
      value: 3
    },
    {
      label: "日考",
      value: 4
    },
    {
      label: "测验",
      value: 5
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
  },
  operationSymbol: {
    0: ">",
    1: ">=",
    2: "=",
    3: "<=",
    4: "<",
    5: "!="
  },
  examinationType: {
    0: "期中考试",
    1: "期末考试",
    2: "月考",
    3: "周考",
    4: "日考",
    5: "测验"
  }
}

const DataDict = {
  list: dataList,
  type: dataType
}

export default DataDict
