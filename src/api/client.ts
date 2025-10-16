import axios from 'axios';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.wearagain.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add auth token if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      clearAuthToken();
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  },
);

// Helper functions for token management
function getAuthToken(): string | null {
  // TODO: Implement token retrieval from secure storage
  return null;
}

function clearAuthToken(): void {
  // TODO: Implement token clearing from secure storage
}
