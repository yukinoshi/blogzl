import serve from '../utils/axios'
import type { Code, ReqAddLabel, Res, ResLabelData } from '../utils/interface'

/**
 * 获取标签数据
 * @returns 返回标签数据
 */
export const getLabelApi = async () => {
  return await serve.post('/label') as ResLabelData
}
/**
 * 新建标签
 * @param value 新建标签数据
 * @returns 返回code200成功和data标签id
 */
export const addLabelApi = async (value: ReqAddLabel) => {
  return await serve.post('/addLabel', value) as Res
}
/**
 * 删除标签根据id
 * @param label_id 标签id
 * @returns 返回200删除成功
 */
export const deleteLabelApi = async (label_id: number) => {
  return await serve.post('/deleteLabel', { label_id }) as Code
}