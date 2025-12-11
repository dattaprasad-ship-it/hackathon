import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('setToken', () => {
    it('should store token in localStorage by default', () => {
      storage.setToken('test-token-123');

      expect(localStorage.getItem('authToken')).toBe('test-token-123');
    });

    it('should store token in sessionStorage when specified', () => {
      storage.setToken('test-token-123', 'sessionStorage');

      expect(sessionStorage.getItem('authToken')).toBe('test-token-123');
      expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('should handle storage errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: vi.fn(() => {
            throw new Error('QuotaExceededError');
          }),
          getItem: vi.fn(),
          removeItem: vi.fn(),
        },
        writable: true,
      });

      expect(() => storage.setToken('test-token')).not.toThrow();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getToken', () => {
    it('should retrieve token from localStorage by default', () => {
      localStorage.setItem('authToken', 'test-token-123');

      const token = storage.getToken();

      expect(token).toBe('test-token-123');
    });

    it('should retrieve token from sessionStorage when specified', () => {
      sessionStorage.setItem('authToken', 'test-token-456');

      const token = storage.getToken('sessionStorage');

      expect(token).toBe('test-token-456');
    });

    it('should return null when token does not exist', () => {
      const token = storage.getToken();

      expect(token).toBeNull();
    });

    it('should handle storage errors gracefully', () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn(() => {
            throw new Error('Storage error');
          }),
          setItem: vi.fn(),
          removeItem: vi.fn(),
        },
        writable: true,
      });

      const token = storage.getToken();

      expect(token).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage by default', () => {
      localStorage.setItem('authToken', 'test-token-123');

      storage.removeToken();

      expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('should remove token from sessionStorage when specified', () => {
      sessionStorage.setItem('authToken', 'test-token-456');

      storage.removeToken('sessionStorage');

      expect(sessionStorage.getItem('authToken')).toBeNull();
    });

    it('should handle storage errors gracefully', () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          removeItem: vi.fn(() => {
            throw new Error('Storage error');
          }),
          getItem: vi.fn(),
          setItem: vi.fn(),
        },
        writable: true,
      });

      expect(() => storage.removeToken()).not.toThrow();
    });
  });

  describe('hasToken', () => {
    it('should return true when token exists in localStorage', () => {
      localStorage.setItem('authToken', 'test-token-123');

      expect(storage.hasToken()).toBe(true);
    });

    it('should return true when token exists in sessionStorage', () => {
      sessionStorage.setItem('authToken', 'test-token-456');

      expect(storage.hasToken('sessionStorage')).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(storage.hasToken()).toBe(false);
    });
  });
});

