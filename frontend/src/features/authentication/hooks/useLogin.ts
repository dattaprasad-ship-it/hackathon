import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = React.useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login({ username, password });
        await login(response.user, response.token);
        navigate('/dashboard');
      } catch (err: any) {
        let errorMessage = 'An error occurred during login';
        
        if (err?.response) {
          // Server responded with error status
          const status = err.response.status;
          if (status === 404) {
            errorMessage = 'Backend API is not available. Please ensure the backend server is running.';
          } else if (status === 401) {
            errorMessage = 'Invalid username or password. Please check your credentials and try again.';
          } else if (status === 400) {
            errorMessage = err.response.data?.error?.message || 'Invalid request. Please check your input.';
          } else if (status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = err.response.data?.error?.message || `Request failed with status code ${status}`;
          }
        } else if (err?.request) {
          // Request was made but no response received
          errorMessage = 'Unable to connect to the server. Please check your network connection and ensure the backend is running.';
        } else if (err instanceof Error) {
          // Error setting up the request
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate]
  );

  return {
    handleLogin,
    isLoading,
    error,
  };
};

