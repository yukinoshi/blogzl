//配置axios
import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { baseUrl } from './env';
import { YkMessage } from '@yike-design/ui';
import { isTokenExpired } from './auth';
import pinia from '../store';
import { useUserStore } from '../store/user';

const userStore = useUserStore(pinia);

const readTokenFromStorage = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return parsed?.token || '';
  } catch {
    return '';
  }
};

const getToken = () => userStore.token || readTokenFromStorage();

const persistToken = (token: string) => {
  userStore.setToken(token);
  try {
    const snapshot = {
      id: userStore.id,
      name: userStore.name,
      avatarIndex: userStore.avatarIndex,
      token,
    };
    localStorage.setItem('user', JSON.stringify(snapshot));
  } catch {
    // ignore storage sync errors
  }
};

const clearStoredUser = () => {
  userStore.clearUser();
  try { localStorage.removeItem('user'); } catch { /* ignore */ }
};

const authFreePaths = ['/login', '/refreshToken', '/logout'];
const isAuthFreeRequest = (url?: string) => {
  if (!url) return false;
  return authFreePaths.some((path) => url.includes(path));
};

const service = axios.create({
  baseURL: baseUrl,
  timeout: 5000, // 请求超时时间
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  withCredentials: true,
});

let refreshingPromise: Promise<string> | null = null;

const requestRefreshToken = async (): Promise<string> => {
  if (!refreshingPromise) {
    refreshingPromise = refreshClient.post('/refreshToken').then((res) => {
      if (res?.data?.code === 200 && res.data.data?.token) {
        const newToken = res.data.data.token;
        persistToken(newToken);
        return newToken;
      }
      throw new Error(res?.data?.message || '刷新 Token 失败');
    }).finally(() => {
      refreshingPromise = null;
    });
  }
  return refreshingPromise;
};

const safeLogout = async () => {
  clearStoredUser();
  try { await refreshClient.post('/logout'); } catch { /* ignore */ }
};

service.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;
    if (!isAuthFreeRequest(config.url)) {
      let token = getToken();
      if (!token || isTokenExpired(token)) {
        try {
          token = await requestRefreshToken();
        } catch (refreshError) {
          await safeLogout();
          return Promise.reject(refreshError);
        }
      }
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    YkMessage({ type: 'warning', message: error.message });
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.status === 200) return response.data;
    YkMessage({ type: 'warning', message: '请求发送异常' });
    return Promise.reject(new Error('请求发送异常'));
  },
  async (error: AxiosError) => {
    const { response, config } = error;
    const status = response?.status;
    const requestPath = (config as AxiosRequestConfig)?.url || '';

    if (status === 401 && !isAuthFreeRequest(requestPath)) {
      await safeLogout();
      YkMessage({ type: 'warning', message: '登录已过期，请重新登录' });
      return Promise.reject(error);
    }

    const message = (response?.data as any)?.message || error.message || '请求发送异常';
    YkMessage({ type: 'warning', message });
    return Promise.reject(error);
  }
);

export default service;