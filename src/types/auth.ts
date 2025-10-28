export type SocialProvider = 'kakao' | 'apple' | 'google';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
}

export interface AuthenticatedUserStub {
  id: string;
  nickname?: string;
  profileImageUrl?: string;
  email?: string;
}

export interface AuthCallbackResponse {
  provider: SocialProvider;
  tokens: AuthTokens;
  isNewUser?: boolean;
  user?: AuthenticatedUserStub | null;
}

export interface AuthorizationResult {
  code: string;
  state?: string;
}
