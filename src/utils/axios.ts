//配置axios
import axios from 'axios';
import { baseUrl } from './env';
import { YkMessage } from '@yike-design/ui';

const service = axios.create({
  baseURL: baseUrl,
  timeout: 5000, // 请求超时时间
});

service.interceptors.request.use(
  (config) => {
    // 跨域
    config.withCredentials = true;
    const token = localStorage.getItem('token');
    // 2. 如果 token 存在，则将其添加到请求头中
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    YkMessage({type:'warning',message: error.message});
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      YkMessage({type:'warning',message: '请求发送异常'});
      return Promise.reject(new Error('请求发送异常'));
    }
  },
  (error) => {
    // 对请求错误做些什么
    YkMessage({type:'warning',message: error.message});
    return Promise.reject(error);
  }
);

export default service;