import Mock from 'mockjs';

export const survey = Mock.mock({
  "data": {
    "device": [
      {
        "key": 'mobile',
        "name": '移动端',
        "value|10-120": 50,
      },
      {
        "key": 'pc',
        "name": '电脑端',
        "value|10-120": 50,
      }
    ],
    "website": [
      {
        "key": 'home',
        "name": '首页',
        "value|10-120": 50,
      },
      {
        "key": 'project',
        "name": '项目',
        "value|10-120": 50,
      },
      {
        "key": 'diary',
        "name": '日记',
        "value|10-120": 50,
      },
      {
        "key": 'photo',
        "name": '摄影',
        "value|10-120": 50,
      }
    ]
  }
})
