export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'Employee';
  displayName?: string;
  profilePicture?: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface AuthErrorResponse {
  error: AuthError;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type UserRole = 'Admin' | 'Employee';

export interface TokenPayload {
  id: string;
  username: string;
  role: UserRole;
  exp: number;
  iat: number;
}

