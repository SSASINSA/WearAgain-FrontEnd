import EncryptedStorage from 'react-native-encrypted-storage';
import {logError, logInfo} from '../logger';

const REFRESH_TOKEN_KEY = 'wearAgain.refreshToken';

export async function storeRefreshToken(token: string): Promise<void> {
  try {
    await EncryptedStorage.setItem(
      REFRESH_TOKEN_KEY,
      JSON.stringify({token, storedAt: Date.now()}),
    );
    logInfo('Stored refresh token securely');
  } catch (error) {
    logError('Failed to store refresh token', error);
    throw error;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    const storedValue = await EncryptedStorage.getItem(REFRESH_TOKEN_KEY);
    console.log(storedValue);
    if (!storedValue) {
      return null;
    }

    try {
      const parsed = JSON.parse(storedValue) as {
        token?: string;
      };
      return typeof parsed.token === 'string' ? parsed.token : null;
    } catch (parseError) {
      logError('Failed to parse refresh token payload', parseError);
      return null;
    }
  } catch (error) {
    logError('Failed to read refresh token', error);
    return null;
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await EncryptedStorage.removeItem(REFRESH_TOKEN_KEY);
    logInfo('Cleared refresh token from secure storage');
  } catch (error) {
    logError('Failed to clear refresh token', error);
    throw error;
  }
}
