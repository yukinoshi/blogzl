import service from "../utils/axios";
import type { ResVisitData } from "../utils/interface";

/**
 * 获取首页访问量
 * @param period week或者month
 * @returns 返回日期访问量
 */
export const getVisitsStatsApi = async (period: string) => {
  return await service.post('/visitsStats', { period }) as ResVisitData;
}