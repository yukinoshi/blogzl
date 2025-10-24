import serve from '../utils/axios'
import type { Code, ReqAddSubset, ReqSubsetbyId, ReqUpdateSubset, Res, subsetInfo } from '../utils/interface'

/**
 * 获取不同类别的分类列表
 * @param classify 分类的类别
 * @returns 返回该类别的分类如(2)文件的或者(1)图库的(0)文章的
 */
export const GetSubsetApi = async (classify: number) => {
  return await serve.post('/subset', {classify,count: 1}) as subsetInfo
}
/**
 * 新建分类
 * @param value 新建分类ReqAddSubset
 * @returns 返回200新建成功以及分类id
 */
export const addSubsetApi = async (value: ReqAddSubset) => {
  return await serve.post('/addSubset', value) as Res
}
/**
 * 根据id删除分类
 * @param id 分类id
 * @returns 返回成功200
 */
export const deleteSubsetApi = async (id: number) => {
  return await serve.post('/deleteSubset', { id }) as Code
}
/**
 * 根据id更改分类名称
 * @param value 根据id更改subset_name内容
 * @returns 返回成功200
 */
export const updateSubsetApi = async (value: ReqUpdateSubset) => {
  return await serve.post('/updateSubset', value) as Code
}
/**
 * 根据id获取分类信息 带上特定分类的文章数量
 * @param value 根据id和value获取分类的对象
 * @returns 返回分类的对象带article数量
 */
export const getSubsetByIdApi = async (value: ReqSubsetbyId) => {
  return await serve.post('/gainSubset', value) as subsetInfo
}