import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLogin } from '../useLogin';
import { authService } from '../../services/authService';
import { useAuthStore } from '@/store/authStore';
import type { LoginResponse } from '../../types/auth.types';

vi.mock('../../services/authService');
vi.mock('@/store/authStore');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful login', async () => {
    const mockResponse: LoginResponse = {
      token: 'jwt-token-123',
      user: {
        id: '1',
        username: 'admin',
        role: 'Admin',
      },
    };

    const mockLogin = vi.fn().mockResolvedValue(undefined);
    vi.mocked(authService.login).mockResolvedValue(mockResponse);
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
    } as any);

    const { result } = renderHook(() => useLogin());

    await result.current.handleLogin('admin', 'admin123');

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: 'admin',
        password: 'admin123',
      });
      expect(mockLogin).toHaveBeenCalledWith(mockResponse.user, mockResponse.token);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle login error', async () => {
    const error = new Error('Invalid credentials');
    vi.mocked(authService.login).mockRejectedValue(error);
    vi.mocked(useAuthStore).mockReturnValue({
      login: vi.fn(),
    } as any);

    const { result } = renderHook(() => useLogin());

    await result.current.handleLogin('admin', 'wrongpassword');

    await waitFor(() => {
      expect(result.current.error).toBe('Invalid credentials');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should set loading state during login', async () => {
    const mockResponse: LoginResponse = {
      token: 'jwt-token-123',
      user: {
        id: '1',
        username: 'admin',
        role: 'Admin',
      },
    };

    vi.mocked(authService.login).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100))
    );
    vi.mocked(useAuthStore).mockReturnValue({
      login: vi.fn().mockResolvedValue(undefined),
    } as any);

    const { result } = renderHook(() => useLogin());

    const loginPromise = result.current.handleLogin('admin', 'admin123');

    expect(result.current.isLoading).toBe(true);

    await loginPromise;

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should clear error when starting new login attempt', async () => {
    const mockResponse: LoginResponse = {
      token: 'jwt-token-123',
      user: {
        id: '1',
        username: 'admin',
        role: 'Admin',
      },
    };

    vi.mocked(authService.login)
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce(mockResponse);
    vi.mocked(useAuthStore).mockReturnValue({
      login: vi.fn().mockResolvedValue(undefined),
    } as any);

    const { result } = renderHook(() => useLogin());

    await result.current.handleLogin('admin', 'wrongpassword');

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    await result.current.handleLogin('admin', 'admin123');

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});

