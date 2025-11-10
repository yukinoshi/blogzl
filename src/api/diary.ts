import serve from '../utils/axios'
import type { Code, ReqDiary, Res, ResDiaryData } from '../utils/interface'
/**
 * 请求日记页码数据
 * @param data 请求日记页码数据
 * @returns 返回日记页码数据
 */
export const getDiaryApi = async (data: ReqDiary) => {
  return await serve.post('/diary', data) as ResDiaryData
}
/**
 * 根据日记ID删除日记
 * @param diaryId 要删除的日记id
 * @returns 返回code200成功删除
 */
export const deleteDiaryApi = async (diaryId: number) => {
  return await serve.post('/deleteDiary', {diaryId}) as Code
}
/**
 * 新增日记
 * @param data 日记内容
 * @returns 返回新增日记结果
 */
export const addDiaryApi = async (data: any) => {
  return await serve.post('/createDiary', data) as Res
}