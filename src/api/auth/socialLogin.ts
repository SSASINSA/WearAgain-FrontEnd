import axios, {AxiosError} from 'axios';
import type {AuthCallbackResponse, AuthorizationResult, SocialProvider} from '../../types/auth';
import {retry} from '../../utils/network/retry';
import {apiClient} from '../client';
import {AuthError, AuthErrorCode, isAuthError} from './errors';
import {buildAuthorizationUrl, resolveProviderConfig, ResolvedProviderConfig} from './providers';
import {generateOAuthState, startWebAuthFlow} from './webAuthFlow';
import {acquireKakaoIdToken} from './kakaoNative';

interface AuthCallbackSuccessResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
  isNewUser?: boolean;
  user?: AuthCallbackResponse['user'];
}

interface AuthCallbackErrorResponse {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
}

interface KakaoIdTokenLoginRequestPayload {
  idToken: string;
}

export async function performSocialLogin(provider: SocialProvider): Promise<AuthCallbackResponse> {
  const config = resolveProviderConfig(provider);
  if (provider === 'kakao') {
    return performKakaoNativeLogin(config);
  }
  
  return performAuthorizationCodeFlow(provider, config);
}

async function performAuthorizationCodeFlow(
  provider: SocialProvider,
  config: ResolvedProviderConfig,
): Promise<AuthCallbackResponse> {
  if (!config.clientId || !config.redirectUri) {
    throw new AuthError(
      'CONFIG_ERROR',
      '로그인 구성이 완료되지 않았어요. 관리자에게 문의해 주세요.',
      {
        provider,
      },
    );
  }

  const state = generateOAuthState();
  const authorizationUrl = buildAuthorizationUrl(config, {state});

  const authorizationResult = await startWebAuthFlow({
    authorizationUrl,
    redirectUri: config.redirectUri,
    provider,
    state,
  });
  const callbackResponse = await exchangeAuthorizationCode(provider, authorizationResult, config);

  return createAuthCallbackResponse(provider, callbackResponse);
}

async function performKakaoNativeLogin(
  config: ResolvedProviderConfig,
): Promise<AuthCallbackResponse> {
  try {
    const idToken = await acquireKakaoIdToken();
    const response = await retry(
      () =>
        apiClient.post<AuthCallbackSuccessResponse>(
          config.nativeCallbackPath ?? config.callbackPath,
          serializeKakaoIdTokenForBackend(idToken),
        ),
      {
        retries: 2,
        shouldRetry: error => shouldRetryExchange(error),
      },
    );
    console.log(response.data);
    return createAuthCallbackResponse('kakao', response.data);
  } catch (error) {
    throw toAuthError('kakao', error);
  }
}

async function exchangeAuthorizationCode(
  provider: SocialProvider,
  result: AuthorizationResult,
  config: ResolvedProviderConfig,
): Promise<AuthCallbackSuccessResponse> {
  try {
    const response = await retry(
      () =>
        apiClient.post<AuthCallbackSuccessResponse>(config.callbackPath, {
          code: result.code,
          state: result.state,
          redirectUri: config.redirectUri,
        }),
      {
        retries: 2,
        shouldRetry: error => shouldRetryExchange(error),
      },
    );

    return response.data;
  } catch (error) {
    throw toAuthError(provider, error);
  }
}

function shouldRetryExchange(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  if (typeof error.code === 'string') {
    const normalized = error.code.toLowerCase();
    if (normalized.includes('timeout') || normalized === 'econnaborted') {
      return true;
    }
  }

  const status = error.response.status;
  return status >= 500 && status < 600;
}

function serializeKakaoIdTokenForBackend(idToken: string): KakaoIdTokenLoginRequestPayload {
  return {idToken};
}
function toAuthError(provider: SocialProvider, error: unknown): AuthError {
  if (isAuthError(error)) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return fromAxiosError(provider, error);
  }

  return new AuthError('UNKNOWN', '로그인 처리 중 알 수 없는 오류가 발생했어요.', {
    provider,
    cause: error,
  });
}

const BACKEND_CODE_MAP: Record<string, AuthErrorCode> = {
  OAUTH_DENIED: 'OAUTH_DENIED',
  USER_CANCELLED: 'OAUTH_CANCELLED',
  PROVIDER_ERROR: 'BACKEND_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_AUTH_CODE: 'BACKEND_ERROR',
  TOKEN_EXCHANGE_FAILED: 'BACKEND_ERROR',
};

function fromAxiosError(provider: SocialProvider, error: AxiosError<AuthCallbackErrorResponse>): AuthError {
  if (!error.response) {
    return new AuthError('NETWORK_ERROR', '네트워크 연결을 확인해 주세요.', {
      provider,
      cause: error,
    });
  }

  const backendCode = error.response.data?.code;
  const mappedCode = backendCode ? BACKEND_CODE_MAP[backendCode] ?? 'BACKEND_ERROR' : 'BACKEND_ERROR';

  return new AuthError(mappedCode, '로그인 처리 중 문제가 발생했어요.', {
    provider,
    cause: error,
    details: {
      status: error.response.status,
      backendCode,
      backendMessage: error.response.data?.message,
    },
  });
}

function createAuthCallbackResponse(
  provider: SocialProvider,
  data: AuthCallbackSuccessResponse,
): AuthCallbackResponse {
  return {
    provider,
    tokens: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      refreshExpiresIn: data.refreshExpiresIn,
    },
    isNewUser: data.isNewUser,
    user: data.user ?? null,
  };
}
