import serve from '../utils/axios'
import type { OverViewInfo } from '../utils/interface'

/**
 * 获取首页预览数据
 * @returns 返回首页预览数据
 */
export const getOverviewData = async () => {
  return await serve.post('/overview') as OverViewInfo
}

