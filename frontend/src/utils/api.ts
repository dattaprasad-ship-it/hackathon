import axios from 'axios';
import { storage } from './storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      storage.removeToken();
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
      // Handle backend connection errors gracefully
      console.warn('Backend API is not available. Please ensure the backend server is running.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

