import axios from 'axios';
import type {AuthTokens} from '../../types/auth';
import {apiClient} from '../client';
import {logError} from '../../utils/logger';

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
}

export class RefreshTokenError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'RefreshTokenError';
  }
}

export async function refreshAuthTokens(
  refreshToken: string,
): Promise<AuthTokens> {
  try {
    const response = await apiClient.post<RefreshTokenResponse>(
      '/auth/refresh',
      {
        refreshToken,
      },
    );
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      refreshExpiresIn: response.data.refreshExpiresIn,
    };
  } catch (error) {
    logError('Failed to refresh auth tokens', error);

    if (axios.isAxiosError(error)) {
      throw new RefreshTokenError('Token refresh request failed', error);
    }

    throw new RefreshTokenError('Unknown error during token refresh', error);
  }
}
