import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';
import type { User } from '@/features/authentication/types/auth.types';
import { storage } from '@/utils/storage';

vi.mock('@/utils/storage', () => ({
  storage: {
    setToken: vi.fn(),
    getToken: vi.fn(),
    removeToken: vi.fn(),
    hasToken: vi.fn(),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should update user in state', () => {
      const user: User = {
        id: '1',
        username: 'admin',
        role: 'Admin',
      };

      useAuthStore.getState().setUser(user);

      expect(useAuthStore.getState().user).toEqual(user);
    });
  });

  describe('setToken', () => {
    it('should update token in state and storage', () => {
      const token = 'jwt-token-123';

      useAuthStore.getState().setToken(token);

      expect(useAuthStore.getState().token).toBe(token);
      expect(storage.setToken).toHaveBeenCalledWith(token);
    });
  });

  describe('login', () => {
    it('should update state with user and token on successful login', async () => {
      const user: User = {
        id: '1',
        username: 'admin',
        role: 'Admin',
      };
      const token = 'jwt-token-123';

      await useAuthStore.getState().login(user, token);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.token).toBe(token);
      expect(state.isAuthenticated).toBe(true);
      expect(storage.setToken).toHaveBeenCalledWith(token);
    });

    it('should set isLoading to true during login', async () => {
      const user: User = {
        id: '1',
        username: 'admin',
        role: 'Admin',
      };
      const token = 'jwt-token-123';

      const loginPromise = useAuthStore.getState().login(user, token);
      
      expect(useAuthStore.getState().isLoading).toBe(true);
      
      await loginPromise;
      
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user, token, and authentication state', () => {
      useAuthStore.setState({
        user: {
          id: '1',
          username: 'admin',
          role: 'Admin',
        },
        token: 'jwt-token-123',
        isAuthenticated: true,
        isLoading: false,
      });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(storage.removeToken).toHaveBeenCalled();
    });
  });

  describe('initialize', () => {
    it('should restore auth state from storage if token exists', () => {
      const token = 'jwt-token-123';

      vi.mocked(storage.getToken).mockReturnValue(token);
      vi.mocked(storage.getToken).mockReturnValueOnce(token);

      useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.token).toBe(token);
    });

    it('should not restore state if no token in storage', () => {
      vi.mocked(storage.getToken).mockReturnValue(null);

      useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});

