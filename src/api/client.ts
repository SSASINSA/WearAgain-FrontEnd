import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import {Alert} from 'react-native';
import {getEnvOrThrow} from '../utils/env';
import {useAuthStore} from '../store/auth.store';

const API_BASE_URL = getEnvOrThrow('API_BASE_URL');
const isDevEnvironment =
  (typeof __DEV__ !== 'undefined' && __DEV__) ||
  process.env.NODE_ENV !== 'production';

// 에러 메시지 중복 표시 방지를 위한 플래그
let isShowingUnauthorizedAlert = false;

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

    // refresh 엔드포인트에서 발생한 에러는 그대로 reject
    if (originalRequest?.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const isUnauthorized = status === 401 || status === 403;

    if (isUnauthorized && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await useAuthStore.getState().refreshSession();

      if (accessToken) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } else {
        // 토큰 리프레시 실패 시 로그아웃 처리
        handleUnauthorizedError();
        return Promise.reject(error);
      }
    } else if (isUnauthorized && (!originalRequest || originalRequest._retry)) {
      // 리프레시를 시도했지만 여전히 401/403 에러가 발생한 경우
      handleUnauthorizedError();
    }

    return Promise.reject(error);
  },
);

function handleUnauthorizedError() {
  // 이미 Alert가 표시 중이면 중복 표시 방지
  if (isShowingUnauthorizedAlert) {
    return;
  }

  isShowingUnauthorizedAlert = true;
  
  // Alert 표시와 동시에 로그아웃 처리
  Alert.alert('로그인 필요', '로그인이 필요합니다. 로그인 화면으로 이동합니다.', [
    {
      text: '확인',
      onPress: () => {
        isShowingUnauthorizedAlert = false;
      },
    },
  ]);
  
  useAuthStore.getState().logout('인증이 만료되었습니다.');
}

function shouldAttemptRefresh(error: AxiosError): boolean {
  const status = error.response?.status;
  return status === 401 || status === 403;
}
