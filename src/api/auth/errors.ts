import type {SocialProvider} from '../../types/auth';

export type AuthErrorCode =
  | 'OAUTH_DENIED'
  | 'OAUTH_CANCELLED'
  | 'NETWORK_ERROR'
  | 'PROVIDER_UNAVAILABLE'
  | 'TIMEOUT'
  | 'BACKEND_ERROR'
  | 'UNKNOWN'
  | 'CONFIG_ERROR'
  | 'NOT_IMPLEMENTED'
  | 'STATE_MISMATCH'
  | 'PARSING_ERROR';

export interface AuthErrorOptions {
  provider?: SocialProvider;
  cause?: unknown;
  details?: Record<string, unknown>;
}

export class AuthError extends Error {
  public readonly code: AuthErrorCode;

  public readonly provider?: SocialProvider;

  public readonly details?: Record<string, unknown>;

  constructor(code: AuthErrorCode, message: string, options?: AuthErrorOptions) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.provider = options?.provider;
    this.details = options?.details;

    if (options?.cause) {
      (this as unknown as {cause?: unknown}).cause = options.cause;
    }

    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
