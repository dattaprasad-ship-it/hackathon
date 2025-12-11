import { describe, it, expect } from 'vitest';
import type {
  User,
  LoginRequest,
  LoginResponse,
  AuthError,
  AuthErrorResponse,
  AuthState,
  UserRole,
  TokenPayload,
} from '../auth.types';

describe('Auth Types', () => {
  describe('User', () => {
    it('should have required fields', () => {
      const user: User = {
        id: '1',
        username: 'admin',
        role: 'Admin',
      };

      expect(user.id).toBe('1');
      expect(user.username).toBe('admin');
      expect(user.role).toBe('Admin');
    });

    it('should allow optional displayName', () => {
      const user: User = {
        id: '1',
        username: 'admin',
        role: 'Admin',
        displayName: 'Administrator',
      };

      expect(user.displayName).toBe('Administrator');
    });

    it('should accept Employee role', () => {
      const user: User = {
        id: '2',
        username: 'employee',
        role: 'Employee',
      };

      expect(user.role).toBe('Employee');
    });
  });

  describe('LoginRequest', () => {
    it('should have username and password', () => {
      const request: LoginRequest = {
        username: 'admin',
        password: 'password123',
      };

      expect(request.username).toBe('admin');
      expect(request.password).toBe('password123');
    });
  });

  describe('LoginResponse', () => {
    it('should have token and user', () => {
      const response: LoginResponse = {
        token: 'jwt-token-here',
        user: {
          id: '1',
          username: 'admin',
          role: 'Admin',
        },
      };

      expect(response.token).toBe('jwt-token-here');
      expect(response.user.id).toBe('1');
      expect(response.user.username).toBe('admin');
    });
  });

  describe('AuthError', () => {
    it('should have code and message', () => {
      const error: AuthError = {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      };

      expect(error.code).toBe('INVALID_CREDENTIALS');
      expect(error.message).toBe('Invalid credentials');
    });

    it('should allow optional details', () => {
      const error: AuthError = {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: {
          username: 'Username is required',
          password: 'Password is required',
        },
      };

      expect(error.details).toBeDefined();
      expect(error.details?.username).toBe('Username is required');
    });
  });

  describe('AuthErrorResponse', () => {
    it('should have error object', () => {
      const response: AuthErrorResponse = {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials',
        },
      };

      expect(response.error.code).toBe('INVALID_CREDENTIALS');
      expect(response.error.message).toBe('Invalid credentials');
    });
  });

  describe('AuthState', () => {
    it('should have all required fields', () => {
      const state: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should allow authenticated state', () => {
      const state: AuthState = {
        user: {
          id: '1',
          username: 'admin',
          role: 'Admin',
        },
        token: 'jwt-token',
        isAuthenticated: true,
        isLoading: false,
      };

      expect(state.isAuthenticated).toBe(true);
      expect(state.user).not.toBeNull();
      expect(state.token).not.toBeNull();
    });
  });

  describe('UserRole', () => {
    it('should accept Admin role', () => {
      const role: UserRole = 'Admin';
      expect(role).toBe('Admin');
    });

    it('should accept Employee role', () => {
      const role: UserRole = 'Employee';
      expect(role).toBe('Employee');
    });
  });

  describe('TokenPayload', () => {
    it('should have all required fields', () => {
      const payload: TokenPayload = {
        id: '1',
        username: 'admin',
        role: 'Admin',
        exp: 1234567890,
        iat: 1234567890,
      };

      expect(payload.id).toBe('1');
      expect(payload.username).toBe('admin');
      expect(payload.role).toBe('Admin');
      expect(payload.exp).toBe(1234567890);
      expect(payload.iat).toBe(1234567890);
    });
  });
});

