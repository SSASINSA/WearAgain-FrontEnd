import {create, StateCreator} from 'zustand';
import type {
  AuthCallbackResponse,
  AuthenticatedUserStub,
  AuthTokens,
} from '../types/auth';
import {
  clearRefreshToken,
  getRefreshToken,
  storeRefreshToken,
} from '../utils/storage/secureTokens';
import {refreshAuthTokens, RefreshTokenError} from '../api/auth/session';
import {logError, logInfo} from '../utils/logger';

type AuthStatus = 'idle' | 'hydrating' | 'authenticated' | 'unauthenticated';

interface AuthState {
  accessToken: string | null;
  user: AuthenticatedUserStub | null;
  status: AuthStatus;
  isHydrated: boolean;
  lastError: string | null;
  loginSuccess: (payload: AuthCallbackResponse) => Promise<void>;
  hydrate: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
  logout: (reason?: string) => Promise<void>;
  setUser: (user: AuthenticatedUserStub | null) => void;
  clearError: () => void;
}

let hydrationPromise: Promise<void> | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  status: 'idle',
  isHydrated: false,
  lastError: null,

  loginSuccess: async payload => {
    const {accessToken, refreshToken, expiresIn, refreshExpiresIn} =
      payload.tokens;
    await storeRefreshToken(refreshToken);
    set({
      accessToken,
      user: payload.user ?? null,
      status: 'authenticated',
      isHydrated: true,
      lastError: null,
    });

    logInfo('Login succeeded', {
      provider: payload.provider,
      expiresIn,
      refreshExpiresIn,
    });
  },

  hydrate: async () => {
    if (hydrationPromise) {
      return hydrationPromise;
    }

    hydrationPromise = (async () => {
      set(state => ({
        ...state,
        status: 'hydrating',
        lastError: null,
      }));

      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        set({
          accessToken: null,
          user: null,
          status: 'unauthenticated',
          isHydrated: true,
          lastError: null,
        });
        return;
      }

      try {
        const tokens = await refreshAuthTokens(refreshToken);
        await applyTokens(tokens, set);
        set(state => ({
          ...state,
          status: 'authenticated',
          isHydrated: true,
          lastError: null,
        }));
      } catch (error) {
        logError('Failed to hydrate session', error);
        await clearRefreshToken();
        set({
          accessToken: null,
          user: null,
          status: 'unauthenticated',
          isHydrated: true,
          lastError: buildErrorMessage(error),
        });
      } finally {
        hydrationPromise = null;
      }
    })();

    await hydrationPromise;
  },

  refreshSession: async () => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        await get().logout();
        refreshPromise = null;
        return null;
      }

      try {
        const tokens = await refreshAuthTokens(refreshToken);
        await applyTokens(tokens, set);
        set(state => ({
          ...state,
          status: 'authenticated',
          lastError: null,
          isHydrated: true,
        }));
        return tokens.accessToken;
      } catch (error) {
        logError('Token refresh failed', error);
        await get().logout(buildErrorMessage(error));
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  logout: async (reason?: string) => {
    await clearRefreshToken();
    set({
      accessToken: null,
      user: null,
      status: 'unauthenticated',
      isHydrated: true,
      lastError: reason ?? null,
    });
  },

  setUser: user => {
    set(state => ({
      ...state,
      user,
    }));
  },

  clearError: () => {
    set(state => ({
      ...state,
      lastError: null,
    }));
  },
}));

type SetState = Parameters<StateCreator<AuthState>>[0];

async function applyTokens(tokens: AuthTokens, set: SetState): Promise<void> {
  await storeRefreshToken(tokens.refreshToken);
  set(state => ({
    ...state,
    accessToken: tokens.accessToken,
  }));
}

function buildErrorMessage(error: unknown): string | null {
  if (error instanceof RefreshTokenError) {
    return '세션이 만료되었습니다. 다시 로그인해 주세요.';
  }

  return null;
}
