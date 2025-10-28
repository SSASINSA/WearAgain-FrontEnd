import {Linking} from 'react-native';
import type {AuthorizationResult, SocialProvider} from '../../types/auth';
import {AuthError} from './errors';

const DEFAULT_TIMEOUT_MS = 60_000;
const STATE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const STATE_LENGTH = 32;

export interface WebAuthFlowOptions {
  authorizationUrl: string;
  redirectUri: string;
  state: string;
  provider: SocialProvider;
  timeoutMs?: number;
}

export function generateOAuthState(length: number = STATE_LENGTH): string {
  let result = '';
  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * STATE_ALPHABET.length);
    result += STATE_ALPHABET[randomIndex];
  }
  return result;
}

export async function startWebAuthFlow(options: WebAuthFlowOptions): Promise<AuthorizationResult> {
  const {authorizationUrl, redirectUri, state, provider, timeoutMs = DEFAULT_TIMEOUT_MS} = options;

  const canOpen = await Linking.canOpenURL(authorizationUrl).catch(() => false);
  if (!canOpen) {
    throw new AuthError('PROVIDER_UNAVAILABLE', '로그인 창을 열 수 없어요. 잠시 후 다시 시도해 주세요.', {
      provider,
      details: {authorizationUrl},
    });
  }

  return new Promise<AuthorizationResult>((resolve, reject) => {
    let isSettled = false;

    const cleanup = () => {
      if (isSettled) {
        return;
      }
      isSettled = true;
      if (subscription) {
        subscription.remove();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    const finalizeWithError = (error: AuthError) => {
      if (isSettled) {
        return;
      }
      cleanup();
      reject(error);
    };

    const timeoutId = setTimeout(() => {
      finalizeWithError(
        new AuthError('TIMEOUT', '로그인 시간이 초과되었어요. 다시 시도해 주세요.', {
          provider,
        }),
      );
    }, timeoutMs);

    const subscription = Linking.addEventListener('url', event => {
      if (isSettled) {
        return;
      }

      const incomingUrl = event.url;
      if (!incomingUrl.startsWith(redirectUri)) {
        return;
      }

      try {
        const parsedUrl = new URL(incomingUrl);
        const params = parsedUrl.searchParams;

        const returnedState = params.get('state') ?? undefined;
        if (returnedState && returnedState !== state) {
          finalizeWithError(
            new AuthError('STATE_MISMATCH', '로그인 검증에 실패했어요. 다시 시도해 주세요.', {
              provider,
              details: {expectedState: state, receivedState: returnedState},
            }),
          );
          return;
        }

        const error = params.get('error');
        if (error) {
          const errorCode = error.toLowerCase();
          if (errorCode === 'access_denied') {
            finalizeWithError(
              new AuthError('OAUTH_DENIED', '로그인이 거부되었어요.', {
                provider,
              }),
            );
            return;
          }

          if (errorCode === 'user_cancelled') {
            finalizeWithError(
              new AuthError('OAUTH_CANCELLED', '로그인을 취소했어요.', {
                provider,
              }),
            );
            return;
          }

          finalizeWithError(
            new AuthError('UNKNOWN', '로그인 중 알 수 없는 오류가 발생했어요.', {
              provider,
              details: {error},
            }),
          );
          return;
        }

        const code = params.get('code');
        if (!code) {
          finalizeWithError(
            new AuthError('PARSING_ERROR', '로그인 응답을 해석하지 못했어요.', {
              provider,
              details: {incomingUrl},
            }),
          );
          return;
        }

        cleanup();
        resolve({code, state: returnedState});
      } catch (error) {
        finalizeWithError(
          new AuthError('PARSING_ERROR', '로그인 응답을 처리하지 못했어요.', {
            provider,
            cause: error,
          }),
        );
      }
    });

    Linking.openURL(authorizationUrl).catch(error => {
      const message = typeof error?.message === 'string' ? error.message.toLowerCase() : '';
      const code = message.includes('cancel') ? 'OAUTH_CANCELLED' : 'PROVIDER_UNAVAILABLE';

      finalizeWithError(
        new AuthError(code, '로그인을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.', {
          provider,
          cause: error,
        }),
      );
    });
  });
}
