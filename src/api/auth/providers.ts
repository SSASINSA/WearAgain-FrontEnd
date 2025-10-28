import {DEFAULT_KAKAO_NATIVE_CALLBACK_PATH} from './constants';
import type {SocialProvider} from '../../types/auth';
import {getEnv} from '../../utils/env';
import {AuthError} from './errors';

interface ProviderEnvKeys {
  clientId?: string;
  redirectUri?: string;
  scope?: string;
  nativeCallbackPath?: string;
}

export interface OAuthProviderDefinition {
  id: SocialProvider;
  name: string;
  authorizationEndpoint: string;
  callbackPath: string;
  nativeCallbackPath?: string;
  defaultScopes: string[];
  responseType?: string;
  scopeSeparator?: string;
  implemented: boolean;
  additionalAuthorizeParams?: Record<string, string>;
  requiresClientConfig?: boolean;
}

export interface ResolvedProviderConfig extends OAuthProviderDefinition {
  clientId?: string;
  redirectUri?: string;
  scopes: string[];
}

const PROVIDER_DEFINITIONS: Record<SocialProvider, OAuthProviderDefinition> = {
  kakao: {
    id: 'kakao',
    name: '카카오',
    authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
    callbackPath: DEFAULT_KAKAO_NATIVE_CALLBACK_PATH,
    nativeCallbackPath: DEFAULT_KAKAO_NATIVE_CALLBACK_PATH,
    defaultScopes: ['openid', 'profile_nickname', 'account_email'],
    responseType: 'code',
    scopeSeparator: ' ',
    implemented: true,
    requiresClientConfig: false,
    additionalAuthorizeParams: {
      prompt: 'login',
    },
  },
  apple: {
    id: 'apple',
    name: 'Apple ID',
    authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
    callbackPath: '/auth/apple/callback',
    defaultScopes: ['name', 'email'],
    responseType: 'code',
    scopeSeparator: ' ',
    implemented: false,
    additionalAuthorizeParams: {
      response_mode: 'form_post',
    },
  },
  google: {
    id: 'google',
    name: 'Google',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    callbackPath: '/auth/google/callback',
    defaultScopes: ['profile', 'email'],
    responseType: 'code',
    scopeSeparator: ' ',
    implemented: false,
    additionalAuthorizeParams: {
      access_type: 'offline',
      include_granted_scopes: 'true',
      prompt: 'consent',
    },
  },
};

const PROVIDER_ENV_KEYS: Record<SocialProvider, ProviderEnvKeys> = {
  kakao: {
    clientId: 'OAUTH_KAKAO_CLIENT_ID',
    redirectUri: 'OAUTH_KAKAO_REDIRECT_URI',
    scope: 'OAUTH_KAKAO_SCOPES',
    nativeCallbackPath: 'OAUTH_KAKAO_NATIVE_CALLBACK_PATH',
  },
  apple: {
    clientId: 'APPLE_CLIENT_ID',
    redirectUri: 'APPLE_REDIRECT_URI',
    scope: 'APPLE_AUTH_SCOPES',
  },
  google: {
    clientId: 'GOOGLE_CLIENT_ID',
    redirectUri: 'GOOGLE_REDIRECT_URI',
    scope: 'GOOGLE_AUTH_SCOPES',
  },
};

const PROVIDER_DISPLAY_NAMES: Record<SocialProvider, string> = {
  kakao: '카카오',
  apple: 'Apple ID',
  google: 'Google',
};

function resolveEnvValue(key?: string): string | undefined {
  return key ? getEnv(key) : undefined;
}

export function getProviderDisplayName(provider: SocialProvider): string {
  return PROVIDER_DISPLAY_NAMES[provider] ?? provider;
}

export function isProviderImplemented(provider: SocialProvider): boolean {
  return PROVIDER_DEFINITIONS[provider]?.implemented ?? false;
}

export function resolveProviderConfig(provider: SocialProvider): ResolvedProviderConfig {
  const definition = PROVIDER_DEFINITIONS[provider];
  if (!definition) {
    throw new AuthError('UNKNOWN', '지원되지 않는 로그인 제공자입니다.', {
      provider,
    });
  }

  if (!definition.implemented) {
    throw new AuthError('NOT_IMPLEMENTED', `${definition.name} 로그인을 아직 준비 중이에요.`, {
      provider,
    });
  }

  const requiresClientConfig = definition.requiresClientConfig !== false;
  const envKeys = PROVIDER_ENV_KEYS[provider] ?? {};
  const clientId = resolveEnvValue(envKeys.clientId);
  const redirectUri = resolveEnvValue(envKeys.redirectUri);
  const missingKeys: string[] = [];
  if (requiresClientConfig) {
    if (envKeys.clientId && !clientId) {
      missingKeys.push(envKeys.clientId);
    }
    if (envKeys.redirectUri && !redirectUri) {
      missingKeys.push(envKeys.redirectUri);
    }
  }

  if (missingKeys.length > 0) {
    throw new AuthError(
      'CONFIG_ERROR',
      `${definition.name} 로그인 구성이 완료되지 않았어요. 관리자에게 문의해 주세요.`,
      {
        provider,
        details: {missingKeys},
      },
    );
  }

  const scopeFromEnv = resolveEnvValue(envKeys.scope);
  const scopes = scopeFromEnv
    ? scopeFromEnv
        .split(',')
        .map(scope => scope.trim())
        .filter(Boolean)
    : definition.defaultScopes;
  let nativeCallbackPath = definition.nativeCallbackPath;
  if (envKeys.nativeCallbackPath) {
    const envNativePath = resolveEnvValue(envKeys.nativeCallbackPath);
    if (envNativePath) {
      nativeCallbackPath = envNativePath;
    }
  }
  return {
    ...definition,
    clientId,
    redirectUri,
    scopes,
    nativeCallbackPath,
  };
}

interface BuildAuthorizationUrlOptions {
  state: string;
  extras?: Record<string, string | undefined>;
}

export function buildAuthorizationUrl(
  config: ResolvedProviderConfig,
  options: BuildAuthorizationUrlOptions,
): string {
  if (!config.clientId || !config.redirectUri) {
    throw new AuthError(
      'CONFIG_ERROR',
      `${config.name} 로그인 구성이 완료되지 않았어요. 관리자에게 문의해 주세요.`,
      {
        provider: config.id,
      },
    );
  }

  const params = new Map<string, string>();
  params.set('client_id', config.clientId);
  params.set('redirect_uri', config.redirectUri);
  params.set('response_type', config.responseType ?? 'code');

  if (config.scopes.length > 0) {
    params.set('scope', config.scopes.join(config.scopeSeparator ?? ' '));
  }

  params.set('state', options.state);

  if (config.additionalAuthorizeParams) {
    Object.entries(config.additionalAuthorizeParams).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length > 0) {
        params.set(key, value);
      }
    });
  }

  if (options.extras) {
    Object.entries(options.extras).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length > 0) {
        params.set(key, value);
      }
    });
  }

  const query = Array.from(params.entries())
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `${config.authorizationEndpoint}?${query}`;
}
