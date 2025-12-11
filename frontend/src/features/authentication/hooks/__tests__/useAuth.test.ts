import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useAuthStore } from '@/store/authStore';
import type { User } from '../../types/auth.types';

vi.mock('@/store/authStore');

describe('useAuth', () => {
  const mockUser: User = {
    id: '1',
    username: 'admin',
    role: 'Admin',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user from store', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      logout: vi.fn(),
    } as any);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should return null user when not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    } as any);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should provide logout function', () => {
    const mockLogout = vi.fn();
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: mockLogout,
    } as any);

    const { result } = renderHook(() => useAuth());

    result.current.logout();

    expect(mockLogout).toHaveBeenCalled();
  });
});

