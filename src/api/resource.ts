import service from "../utils/axios";
import type { Code, ReqAddResource, ReqResourcePage, ResourceData, ResResourceData } from "../utils/interface";

/**
 * 获取资源分页
 * @param data 资源的分页信息
 * @returns 返回资源分页
 */
export const getResourcePageApi = async (data: ReqResourcePage) => {
  return await service.post('/resource', data) as ResResourceData;
}
/**
 * 删除资源通过ID
 * @param id 资源的id
 * @returns 返回是否成功200成功
 */
export const deleteResourceByIdApi = async (id: number) => {
  return await service.post('/deleteresource', { id }) as Code;
}
/**
 * 新增资源
 * @param data 资源数据
 * @returns 返回是否成功200成功
 */
export const addResourceApi = async (data: ReqAddResource) => {
  return await service.post('/insertresource', data) as Code;
}
/**
 * 获取资源通过ID
 * @param id 资源的id
 * @param data 资源数据
 * @returns 返回是否成功200成功
 */
export const getResourceByIdApi = async (id: number) => {
  return await service.post('/gainresource', { id }) as { code: Code, data: ResourceData };
}
/**
 * 编辑资源通过ID
 * @param id 修改的资源id
 * @param data 修改的资源内容
 * @returns 返回是否成功code200成功
 */
export const updateResourceByIdApi = async (id: number, data: ReqAddResource) => {
  return await service.post('/updateresource', { id, value: data }) as Code;
}