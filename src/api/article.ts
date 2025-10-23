import serve from '../utils/axios'
import type { articleData, Code, ReqArticle, ReqArticleState, ReqGetArticle, ReqUpdateArticle, Res, ResArticleData } from '../utils/interface'

/**
 * 根据分页 标题简介内容模糊搜索 根据类别搜索文章0或者图库1 根据分类ID 搜索文章
 * @param data 搜索文章条件信息
 * @returns 返回所搜索的文章数据
 */
export const getArticleApi = async (data: ReqGetArticle) => {
  return await serve.post('/article', data) as ResArticleData
}
/**
 * 新增文章
 * @param data 文章内容
 * @returns 返回新增文章结果
 */
export const addArticleApi = async (data: ReqArticle) => {
  return await serve.post('/createArticle', data) as Res
}
/**
 * 修改文章状态
 * @param data 文章状态修改
 * @returns 返回修改结果
 */
export const changeArticleStateApi = async (data: ReqArticleState) => {
  return await serve.post('/changeArticleState', data) as Code
}
/**
 * 删除文章
 * @param articleId 文章ID
 * @returns 返回删除结果
 */
export const deleteArticleApi = async (articleId: number) => {
  return await serve.post('/deleteArticle', { articleId }) as Code
}
/**
 * 根据文章ID获取文章数据
 * @param articleId 文章ID
 * @returns 返回文章数据
 */
export const getArticleByIdApi = async (articleId: number) => {
  return await serve.post('/gainArticle', { articleId }) as Code & {data: articleData}
}
/**
 * 更新文章
 * @param data 文章内容
 * @returns 返回更新结果
 */
export const updateArticleApi = async (data:  ReqUpdateArticle) => {
  return await serve.post('/updateArticle', data) as Code
}