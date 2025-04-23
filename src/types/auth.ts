
// 유저 역할 (백엔드에서만 사용)
export type UserRole = 'USER' | 'INSTRUCTOR' | 'ADMIN';

// 로그인 시 전역 상태에 저장될 유저 정보 (프론트 기준)
export interface User {
  sub: string;
  nickname: string;
  profileImage?: string; // ✅ 대표 이미지 필드
  role?: UserRole; // Added role field for front-end use
}

// 로그인 요청 DTO
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 DTO
export interface LoginResponse {
  loggedIn: boolean;
  accessToken: string;
  message: string;
}

// 회원가입 요청 DTO
export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  profileImage?: File; // ✅ 타입: File | undefined
}

// 회원가입 응답 DTO
export interface RegisterResponse {
  success: boolean;
  accessToken?: string;
  message: string;
}

// 이메일 인증 코드 요청 DTO
export interface EmailVerificationRequest {
  email: string;
}

// 이메일 인증 코드 확인 요청 DTO
export interface CodeVerificationRequest {
  email: string;
  code: string;
}

// 이메일 인증 응답 DTO
export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

// 프로필 업데이트 응답 DTO
export interface ProfileUpdateResponse {
  success: boolean;
  accessToken?: string;
  message: string;
}

// OAuth 코드 교환 요청 DTO
export interface OAuthCodeExchangeRequest {
  code: string;
  state: string;
}

// OAuth 코드 교환 응답 DTO
export interface OAuthCodeExchangeResponse {
  accessToken: string;
  needsLinking?: boolean;
  message?: string;
}
