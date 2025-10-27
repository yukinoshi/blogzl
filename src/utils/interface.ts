export type ReplyData = {
  id: number;
  article?: {
    id: number;
    title: string;
  };
  user_name: string;
  content: string;//内容
  moment: string;//时间
  complaint?: number;//举报数
};

export type SubsetData = {
  id: number;
  subset_name: string | number;
  value: number;//数据总数
  moment: string;//时间
}

export interface FileData {
  id: number;
  url: string;
  fileName: string | number;
  format: string;
  subsetId: number;
  selected?: boolean;
}

export type labelData = {
  id: number;
  label_name: string | number;
  moment: string
}

export type articleData = {
  id: number;
  title: string;
  subset_id?: number;
  moment: string;//时间
  label?: string[];
  introduce?: string;//简介 
  cover?: string;//封面地址
  views: number;//查看次数
  state: number;//状态0未发布、1已发布
  comment: number;//评论数
  praise: number;//点赞次数
  content?: string | string[] | undefined | Photo[];//内容
}

export type galleryData = articleData


export interface Photo {
  id: number;
  url: string;
}

export type diaryData = {
  id: number;
  title: string;
  moment: Date;//时间
  weather_id: number;//天气
  content: string;//内容
  picture?: string[];//图片
}

export type UserRegister = {
  name: string;
  password: string;
  moment: string;
}

export type Code = {
  code: number;
}

export type ReturnUserInfo = Code & {
  data?: {
    id: number;
    name: string;
    token: string;
  }
}

export type OverViewInfo = Code & {
  data?: {
    file: string;
    article: number;
    gallery: number;
    diary: number;
  }
}

export type CommentInfo = Code & {
  data: {
    count?: number;
    list: {
      id: number;
      atricle?: {
        id: number;
        title: string;
      };
      user_id: string;
      user_name: string;
      comment: string;//内容
      moment: string;//时间
      complaint: number;//举报数
    }[]
  }
}

export type PageType = {
  pageSize: number;//单页条数；
  nowPage: number;//当前页
  count?: boolean;//是否返回总条数
}

export type ReqCommentData = PageType;

export type ReqMessageData = PageType;

export type MessageInfo = Code & {
  data: {
    count?: number;
    list: {
      id: number;
      user_id: string;
      user_name: string;
      comment: string;//内容
      moment: string;//时间
      isread: number;
    }[];
  }
}

export type Classify = {
  classify: number;
}

export type SubsetPayload = Classify & {
  moment: string;
  subset_name: string | number;
}

export type ReqAddSubset = {
  value: SubsetPayload;
}

export type Res = {
  code: number;//200正常、300未通过token验证、500错误、400功能拒绝
  data: number;//分类id
}

export type subsetInfo = Code & {
  data: {
    count: number;
    list: SubsetData[];
  }
}

export type ReqUpdateSubset = {
  id: number;
  subset_name: string | number;
}

export type ReqSubsetbyId = {
  value: {
    id: number;
    count: number;
  }[];
}

export type ResLabelData = Code & {
  data: labelData[];
}

export type ReqAddLabel = {
  value: {
    label_name: string | number;
    moment: string;
  };
}

export type ReqGetArticle = PageType & {
  state?: number;//状态
  subsetId?: number;//分组
  serchTerm?: string | number;//搜索词条
  classify: number;//类别
}

export type ReqGetAllArticle = {
  state?: number;//状态
  subsetId?: number;//分组
  serchTerm?: string | number;//搜索词条
  classify: number;//类别
}

export type ResArticleData = Code & {
  data: {
    count: number;
    countUnpublish: number;
    list: articleData[];
  };
}

export type ResAllArticleData = Code & {
  data: {
    list: articleData[];
  };
}

export type ResFileData = Code & {
  data: {
    id: number;
    url: string;//地址
    file_name: string;//文件名
    format: string;//格式
    subset_id?: number;//所属类型
  }
}
export type ReqArticle = {
  value: {
    title: string;
    subset_id?: number;
    classify: number;
    label?: string[];
    introduce?: string;//简介 
    content?: string | string[];//内容
    cover?: string;//封面地址
    state?: number;//状态0未发布、1已发布
    moment: string;//时间
  }
}

export type ReqUpdateArticle = ReqArticle & {
  id: number;
}

export type ReqArticleState = {
  articleId: number
  state: number
}

export type ReqDiary = PageType & {
  serchTerm?: string | number;//搜索词条
}

export type ResDiaryData = Code & {
  data: {
    count: number;
    list: diaryData[];
  }
}

export type ReqAddDiary = {
  title: string;
  content: string;
  picture: string[] | string;
  weather_id: number;
  moment: string;
}