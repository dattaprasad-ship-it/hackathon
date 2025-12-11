import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { authService } from '../authService';
import type { LoginRequest, LoginResponse, AuthErrorResponse } from '../../types/auth.types';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123',
      };

      const mockResponse: LoginResponse = {
        token: 'jwt-token-123',
        user: {
          id: '1',
          username: 'admin',
          role: 'Admin',
          displayName: 'Administrator',
        },
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await authService.login(mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockRequest, {
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should throw error for invalid credentials (401)', async () => {
      const mockRequest: LoginRequest = {
        username: 'admin',
        password: 'wrongpassword',
      };

      const mockErrorResponse: AuthErrorResponse = {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials',
        },
      };

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 401,
          data: mockErrorResponse,
        },
        isAxiosError: true,
      });

      await expect(authService.login(mockRequest)).rejects.toMatchObject({
        response: {
          status: 401,
          data: mockErrorResponse,
        },
      });

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockRequest, {
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should throw error for server error (500)', async () => {
      const mockRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123',
      };

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 500,
          data: {
            error: {
              code: 'INTERNAL_SERVER_ERROR',
              message: 'An error occurred. Please try again later.',
            },
          },
        },
        isAxiosError: true,
      });

      await expect(authService.login(mockRequest)).rejects.toMatchObject({
        response: {
          status: 500,
        },
      });
    });

    it('should throw error for network failure', async () => {
      const mockRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123',
      };

      const networkError = new Error('Network Error');
      mockedAxios.post.mockRejectedValueOnce(networkError);

      await expect(authService.login(mockRequest)).rejects.toThrow('Network Error');
    });

    it('should throw error for validation error (400)', async () => {
      const mockRequest: LoginRequest = {
        username: '',
        password: '',
      };

      const mockErrorResponse: AuthErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Username and password are required',
          details: {
            username: 'Username is required',
            password: 'Password is required',
          },
        },
      };

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: mockErrorResponse,
        },
        isAxiosError: true,
      });

      await expect(authService.login(mockRequest)).rejects.toMatchObject({
        response: {
          status: 400,
          data: mockErrorResponse,
        },
      });
    });
  });
});

