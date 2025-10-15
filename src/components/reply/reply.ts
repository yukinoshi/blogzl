import type { ReplyData } from "../../utils/interface";

export type CommentProps = {
  pageSize: number;//单页条数；
  height?: string;//高度
}

export type ReplyProps = {
  content?: ReplyData;
  isComment: boolean;//是否是评论
}

export type InformationProps = {
  pageSize: number;//单页条数；
  active: boolean;//是否激活
}