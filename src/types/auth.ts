
export interface User {
  id?: number;
  email: string;
  nickname: string;
  role: UserRole;
  createdAt?: string;
}

export type UserRole = 'USER' | 'INSTRUCTOR' | 'ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  loggedIn: boolean;
  accessToken: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  role?: UserRole;
}

export interface RegisterResponse {
  isSuccess: boolean;
  message: string;
  userId?: number;
}

export interface EmailVerificationRequest {
  email: string;
  code?: string;
}
