export type ReplyData = {
  id: number;
  article?: {
    id: number;
    title: string;
  };
  user: {
    id: number,
    name: string;
  }
  comment: string;//内容
  moment: string;//时间
  complaint?: number;//举报数
};

export type SubsetData = {
  id: number | string;
  name: string | number;
  value: number;
  moment?: string
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
  id: number | string;
  name: string | number;
  moment?: string
}

export type articleData = {
  id: number;
  title: string;
  subsetId?: number;
  moment: Date;//时间
  label?: string[];
  introduce?: string;//简介 
  cover?: string;//封面地址
  views: number;//查看次数
  state: number;//状态0未发布、1已发布
  comment: number;//评论数
  praise: number;//点赞次数
}

export type galleryData = {
  id: number;
  title: string;
  subsetId?: number;
  moment: Date;//时间
  label?: string[];
  introduce?: string;//简介 
  cover?: string;//封面地址
  views: number;//查看次数
  state: number;//状态0未发布、1已发布
  comment: number;//评论数
  praise: number;//点赞次数
  content?: string | string[];//图片地址
}

export type diaryData = {
  id: number;
  title: string;
  moment: Date;//时间
  weatherId: number;//天气
  content: string;//内容
  picture?: string[];//图片
}

export type UserRegister = {
  name: string;
  password: string;
  moment: string;
}

export type IsSuccess = {
  code: number;
}

export type ReturnUserInfo = IsSuccess & {
  data?: {
    id: number;
    name: string;
    token: string;
  }
}