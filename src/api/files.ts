import serve from '../utils/axios'
import type { Code, ReqChangeFileSubset, ReqFileData, ResFileData, ResPageFileData } from '../utils/interface'
/**
 * 上传单个文件
 * @param data 上传文件
 * @returns 返回上传成功文件的信息
 */
export const uploadFileApi = async (data: FormData) => {
  return await serve.post('/upload', data) as ResFileData
}
/**
 * 根据文件id删除文件
 * @param filesId 文件的id
 * @returns 返回删除成功200
 */
export const deleteFileApi = async (filesId: number) => {
  return await serve.post('/deleteFile', { filesId }) as Code
}
/**
 * 获取文件分页信息
 * @param data 请求文件分页条件
 * @returns 返回文件分页结果
 */
export const getFileApi = async (data: ReqFileData) => {
  return await serve.post('/file', data) as ResPageFileData
}
/**
 * 切换文件分类
 * @param data 文件id和分类id
 * @returns 返回修改结果200成功
 */
export const changeFileSubsetApi = async (data: ReqChangeFileSubset) => {
  return await serve.post('/removeFile', data) as Code
}