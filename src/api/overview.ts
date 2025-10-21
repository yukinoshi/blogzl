import serve from '../utils/axios'
import type { OverViewInfo,CommentInfo,ReqCommentData,ReqMessageData, MessageInfo } from '../utils/interface'

/**
 * 获取首页预览数据
 * @returns 返回首页预览数据
 */
export const getOverviewData = async () => {
  return await serve.post('/overview') as OverViewInfo
}
/**
 * 获取评论页面数据
 * @param data 获取评论页面数据
 * @returns 返回评论页面信息
 */
export const getCommentData = async (data: ReqCommentData) => {
  return await serve.post('/comment',data) as CommentInfo
}
/**
 * 删除评论根据id
 * @param id 评论ID
 * @returns 返回200删除成功
 */
export const deleteCommentApi = async (id: number) => {
  return await serve.post('/deletecomment', { id }) as {code: number}
}

/**
 * 获取私信页面数据
 * @param data 获取私信页面数据
 * @returns 返回私信页面信息
 */
export const getMessageData = async (data: ReqMessageData) => {
  return await serve.post('/message',data) as MessageInfo
}

/**
 * 删除私信根据id
 * @param id 私信ID
 * @returns 返回200删除成功
 */
export const deleteMessageApi = async (id: number) => {
  return await serve.post('/deleteMessage', { id }) as {code: number}
}

/**
 * 获取未读私信数量
 * @returns 返回未读私信数量
 */
export const getUnreadMessageCountApi = async () => {
  return await serve.post('/getUnreadMessageCount') as {code: number, data: {count: number}}
}