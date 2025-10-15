import Mock from 'mockjs';
const Random = Mock.Random;
export const overview = Mock.mock({
  //返回数据
  "code": 200,
  "data": {
    "file": Random.float(60, 100, 2, 2) + 'M',
    "article|0-50": 0,
    "gallery|0-50": 0,
    "diary|0-50": 0,
  }
})

export const visit = Mock.mock({
  "data|30": [
    {
      "date": "@datetime('MM-dd')",
      "count|10-100": 12,
    }
  ]
})

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

export const comment = Mock.mock({
  "data": {
    "count": 123,
    "list|123": [{
      "id+1": 0,
      "article": {
        "id|+1": 2,
        "title": "@ctitle(3,12)",
      },
      "user": {
        "id|+1": 3,
        "name": "@ctitle(3,12)",
        "imgurl": "https://www.huohuo90.com:3003/user/6353b034dd4b583975e77fbe.png"
      },
      "comment": "@cparagraph(1,4)",
      "moment": "@datetime('yyyy-MM-dd hh:mm:ss')",
      "complaint|0-20": 0,
    }]
  }
})

export const state = Mock.mock({
  "data": [
    {
      "id": 0,
      "name": "已发布",
      "value|0-30": 20
    },
    {
      "id": 1,
      "name": "未发布",
      "value|0-30": 4
    }
  ]
})

export const subset = Mock.mock({
  "data": {
    "count": 120,
    "list|4": [{
      "id|+1": 0,
      "name": "@ctitle(2,5)",
      "value|0-30": 10,
      "moment": "@datetime()"
    }]
  }
})

const photos = [
  "a.jpg",
  "b.jpg",
  "c.jpg",
  "d.jpg",
  "e.jpg",
  "f.jpg",
  "g.jpg",
  "h.jpg",
  "i.jpg",
  "j.jpg",
  "k.jpg",
  "l.jpg",
  "m.jpg",
  "n.jpg",
  "o.jpg",
  "p.jpg",
  "q.jpg",
]

const photoarr = [
  ["a.jpg", "b.jpg", "c.jpg", "d.jpg", "e.jpg", "f.jpg"],
  ["g.jpg", "h.jpg", "k.jpg", "l.jpg"],
  ["m.jpg", "n.jpg"],
  ["o.jpg", "p.jpg", "q.jpg"],
  ["d.jpg", "e.jpg", "f.jpg"],
]

export const mkfiles = Mock.mock({
  "count": 64,
  "list|64": [{
    "id|+1": 0,
    "url|1": photos,
    "fileName": "@ctitle(2,12)",
    "format": "jpeg",
    "subsetId|0-4": 3
  }]
})

export const label = Mock.mock({
  "count": 64,
  "list|12": [{
    "id|+1": 0,
    "name": "@ctitle(2,4)",
    "moment": "@datetime()"
  }]
})

export const article = Mock.mock({
  "count": 64,
  "list|64": [{
    "id|+1": 0,
    "title": "@ctitle(4,12)",
    "cover|1": photos,
    "moment": "@datetime()",
    "label|0-3": ["@ctitle(2,12)"],
    "introduce": "@cparagraph(1,4)",
    "views|12-783": 122,
    "subsetId|0-4": 0,
    "state|0-1": 0,
    "comment|8-24": 13,
    "praise|8-124": 23
  }]
})

export const gallery = Mock.mock({
  "count": 64,
  "list|64": [{
    "id|+1": 0,
    "title": "@ctitle(4,12)",
    "cover|1": photos,
    "moment": "@datetime()",
    "label|0-3": ["@ctitle(2,12)"],
    "introduce": "@cparagraph(1,4)",
    "views|12-783": 122,
    "subsetId|0-4": 0,
    "content|1": photoarr,
    "comment|8-24": 13,
    "praise|8-124": 23
  }]
})

export const diary = Mock.mock({
  "count": 64,
  "list|64": [{
    "id|+1": 0,
    "title": "@ctitle(4,12)",
    "moment": "@datetime()",
    "weatherId|0-7": 0,
    "content": "@cparagraph(2,10)",
    "picture|1": photoarr,
  }]
})

export const mphotos = Mock.mock({
  "data|6": [
    {
      "id|+1": 0,
      "url|1": photos,
    }
  ]
})
