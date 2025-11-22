import service from "../utils/axios";
import type { UserRegister,Code,ReturnUserInfo, ChangePasswordPayload, ChangeUserNamePayload } from "../utils/interface";

/**
 * 检查用户是否注册 判断接口是可用
 * @param name 用户名
 * @returns 返回是否注册过 401未注册 200已注册
 */
export const isRegisterApi = async (name: string) => {
  return await service.post('/isRegister', { name });
}
/**
 * 注册用户
 * @param user 用户对象
 * @returns 200注册成功 
 */
export const registerApi = async (user: UserRegister) => {
  return await service.post('/insertUser', user) as Code;
}
/**
 * 登录
 * @param name 用户名
 * @param password 密码
 * @returns ReturnUserInfo对象 200成功 400该用户未注册
 */
export const loginApi = async (name: string, password: string) => {
  return await service.post('/login', { name, password }) as ReturnUserInfo;
}

/**
 * 校验token
 * @returns ReturnUserInfo对象
 */
export const verifyApi = async () => {
  return await service.get('/verify') as ReturnUserInfo;
}

/**
 * 修改密码
 * @param payload 修改密码信息
 * @returns 返回是否成功
 */
export const changePasswordApi = async (payload: ChangePasswordPayload) => {
  return await service.post('/changePassword', payload) as Code;
}

/**
 * 修改用户名
 * @param id 用户id
 * @param newName 新用户名
 * @returns 返回是否成功
 */
export const changeUserNameApi = async (payload: ChangeUserNamePayload) => {
  return await service.post('/changeUserName', payload) as Code;
}