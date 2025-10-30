import {login as kakaoLogin, loginWithKakaoAccount} from '@react-native-seoul/kakao-login';
import type {KakaoOAuthToken} from '@react-native-seoul/kakao-login';
import {AuthError, isAuthError} from './errors';

export async function acquireKakaoIdToken(): Promise<string> {
  let token: KakaoOAuthToken | null = null;

  try {
    token = await kakaoLogin();
    const idToken = extractIdToken(token);
    if (idToken) {
      return idToken;
    }
  } catch (error) {
    if (!shouldFallbackToAccount(error)) {
      throw mapKakaoNativeError(error);
    }
  }

  try {
    token = await loginWithKakaoAccount();
    const idToken = extractIdToken(token);
    if (idToken) {
      return idToken;
    }
    throw new AuthError(
      'BACKEND_ERROR',
      '카카오 ID 토큰을 받을 수 없어요. 잠시 후 다시 시도해 주세요.',
      {provider: 'kakao'},
    );
  } catch (error) {
    if (isAuthError(error)) {
      throw error;
    }
    throw mapKakaoNativeError(error);
  }
}

function extractIdToken(token: KakaoOAuthToken | null): string | undefined {
  const idToken = token?.idToken;
  if (typeof idToken !== 'string') {
    return undefined;
  }
  const trimmed = idToken.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function shouldFallbackToAccount(error: unknown): boolean {
  const code = extractErrorCode(error)?.toUpperCase();
  if (code === 'E_KAKAOTALK_NOT_INSTALLED' || code === 'E_NOT_SUPPORTED') {
    return true;
  }

  const message = extractErrorMessage(error)?.toUpperCase();
  if (!message) {
    return false;
  }

  return (
    message.includes('KAKAOTALK') &&
    (message.includes('NOT INSTALLED') || message.includes('NOT_INSTALLED') || message.includes('UNAVAILABLE'))
  );
}

function mapKakaoNativeError(error: unknown): AuthError {
  if (isAuthError(error)) {
    return error;
  }

  const code = extractErrorCode(error)?.toUpperCase();
  const message = extractErrorMessage(error);
  const normalizedMessage = message?.toUpperCase();

  if ((code && code.includes('CANCEL')) || (normalizedMessage && normalizedMessage.includes('CANCEL'))) {
    return new AuthError('OAUTH_CANCELLED', '카카오 로그인을 취소했어요.', {
      provider: 'kakao',
      cause: error,
    });
  }

  if (code === 'E_IN_PROGRESS_OPERATION') {
    return new AuthError(
      'PROVIDER_UNAVAILABLE',
      '카카오 로그인이 이미 진행 중이에요. 잠시 후 다시 시도해 주세요.',
      {
        provider: 'kakao',
        cause: error,
      },
    );
  }

  if (code === 'E_NETWORK_ERROR' || (normalizedMessage && normalizedMessage.includes('NETWORK'))) {
    return new AuthError('NETWORK_ERROR', '네트워크 연결을 확인해 주세요.', {
      provider: 'kakao',
      cause: error,
    });
  }

  return new AuthError(
    'PROVIDER_UNAVAILABLE',
    '카카오 로그인 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.',
    {
      provider: 'kakao',
      cause: error,
    },
  );
}

function extractErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object') {
    const {code, errorCode} = error as {code?: unknown; errorCode?: unknown};
    const candidate = typeof code === 'string' ? code : errorCode;
    if (typeof candidate === 'string') {
      return candidate;
    }
  }

  return undefined;
}

function extractErrorMessage(error: unknown): string | undefined {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as {message?: unknown}).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  return undefined;
}
