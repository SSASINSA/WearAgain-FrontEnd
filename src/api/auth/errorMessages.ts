import type {SocialProvider} from '../../types/auth';
import {AuthErrorCode, isAuthError} from './errors';
import {getProviderDisplayName} from './providers';

const DEFAULT_ERROR_MESSAGE = '로그인에 실패했어요. 잠시 후 다시 시도해 주세요.';

type ErrorMessageMapper = (providerName: string) => string;

const ERROR_MESSAGES: Record<AuthErrorCode, ErrorMessageMapper> = {
  OAUTH_DENIED: provider => `${provider} 로그인이 거부되었어요. 다른 계정으로 시도해 주세요.`,
  OAUTH_CANCELLED: () => '로그인을 취소했어요. 계속하려면 다시 시도해 주세요.',
  NETWORK_ERROR: () => '네트워크 연결을 확인한 뒤 다시 시도해 주세요.',
  PROVIDER_UNAVAILABLE: provider => `${provider} 로그인 창을 열 수 없어요. 잠시 후 다시 시도해 주세요.`,
  TIMEOUT: () => '응답이 지연되고 있어요. 다시 시도해 주세요.',
  BACKEND_ERROR: () => '로그인 처리 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.',
  UNKNOWN: () => DEFAULT_ERROR_MESSAGE,
  CONFIG_ERROR: () => '로그인 구성이 완료되지 않았어요. 관리자에게 문의해 주세요.',
  NOT_IMPLEMENTED: provider => `${provider} 로그인을 곧 지원할 예정이에요.`,
  STATE_MISMATCH: () => '로그인 검증에 실패했어요. 다시 시도해 주세요.',
  PARSING_ERROR: () => '로그인 응답을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
};

export function mapAuthErrorToMessage(provider: SocialProvider, error: unknown): string {
  if (!isAuthError(error)) {
    return DEFAULT_ERROR_MESSAGE;
  }

  const providerName = getProviderDisplayName(provider);
  const mapper = ERROR_MESSAGES[error.code];
  if (!mapper) {
    return DEFAULT_ERROR_MESSAGE;
  }

  return mapper(providerName);
}

export function getDefaultAuthErrorMessage(): string {
  return DEFAULT_ERROR_MESSAGE;
}
