import { create } from 'zustand';
import type { User } from '@/features/authentication/types/auth.types';
import { storage } from '@/utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user: User) => {
    set({ user });
  },

  setToken: (token: string) => {
    storage.setToken(token);
    set({ token, isAuthenticated: true });
  },

  login: async (user: User, token: string) => {
    set({ isLoading: true });
    storage.setToken(token);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    storage.removeToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  initialize: () => {
    // Don't auto-authenticate on initialization
    // User must explicitly log in during this session to be authenticated
    // Authentication requires BOTH token AND user to be present
    const storedToken = storage.getToken();
    set({
      token: storedToken || null,
      isAuthenticated: false, // Always start as unauthenticated, require explicit login
      user: null,
    });
  },
}));

