import serve from '../utils/axios'
import type { Code } from '../utils/interface'
/**
 * 上传单个文件
 * @param data 上传文件
 * @returns 返回上传成功文件的信息
 */
export const uploadFileApi = async (data: object) => {
  return await serve.post('/upload', data)
}
/**
 * 根据文件id删除文件
 * @param filesId 文件的id
 * @returns 返回删除成功200
 */
export const deleteFileApi = async (filesId: number) => {
  return await serve.post('/deleteFile', { filesId }) as Code
}