import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import {getEnvOrThrow} from '../utils/env';
import {useAuthStore} from '../store/auth.store';

const API_BASE_URL = getEnvOrThrow('API_BASE_URL');
const isDevEnvironment =
  (typeof __DEV__ !== 'undefined' && __DEV__) ||
  process.env.NODE_ENV !== 'production';

function logRequest(config: InternalAxiosRequestConfig) {
  if (!isDevEnvironment) {
    return;
  }
  const {method, baseURL, url, params, data, headers} = config;
  console.log('[API][Request]', {
    method,
    url: `${baseURL ?? ''}${url ?? ''}`,
    params,
    data,
    headers,
  });
}

function logResponse(response: AxiosResponse) {
  if (!isDevEnvironment) {
    return;
  }
  console.log('[API][Response]', {
    url: `${response.config.baseURL ?? ''}${response.config.url ?? ''}`,
    status: response.status,
    data: response.data,
  });
}

function logError(error: AxiosError) {
  if (!isDevEnvironment) {
    return;
  }
  console.log('[API][Error]', {
    message: error.message,
    url: error.config ? `${error.config.baseURL ?? ''}${error.config.url ?? ''}` : undefined,
    status: error.response?.status,
    data: error.response?.data,
  });
}

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
    logRequest(config);
    return config;
  },
  error => {
    logError(error as AxiosError);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    logResponse(response);
    return response;
  },
  async error => {
    logError(error);
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
