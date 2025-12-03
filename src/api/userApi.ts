import {apiClient} from './client';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserSummaryResponse,
} from '../types/user';

export const userApi = {
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  },

  async updateDisplayName(displayName: string): Promise<void> {
    await apiClient.patch('/users/display-name', {displayName});
  },

  async changePassword(
    userId: string,
    data: {
      currentPassword: string;
      newPassword: string;
    },
  ): Promise<void> {
    await apiClient.put(`/users/${userId}/password`, data);
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete('/users');
  },

  async getUserSummary(): Promise<UserSummaryResponse> {
    const response = await apiClient.get('/users/summary');
    return response.data;
  },
};
