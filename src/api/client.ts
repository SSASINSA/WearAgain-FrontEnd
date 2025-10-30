import axios, {InternalAxiosRequestConfig, AxiosError} from 'axios';
import {getEnvOrThrow} from '../utils/env';
import {useAuthStore} from '../store/auth.store';

const API_BASE_URL = getEnvOrThrow('API_BASE_URL');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & {
      _retry?: boolean;
    });

    if (originalRequest?.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (shouldAttemptRefresh(error) && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await useAuthStore.getState().refreshSession();

      if (accessToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

function shouldAttemptRefresh(error: AxiosError): boolean {
  const status = error.response?.status;
  return status === 401 || status === 403;
}
