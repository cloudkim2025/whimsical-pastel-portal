// utils/tokenManager.ts
import type { User } from '@/types/auth';
import { decodeTokenPayload } from '@/utils/decodeToken';

export interface DecodedTokenPayload {
  userId: number;
  nickname: string;
  profileImage?: string;
  [key: string]: any;
}

const ACCESS_TOKEN_KEY = 'accessToken';

export const tokenManager = {
  /**
   * 액세스 토큰 저장
   */
  setToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  /**
   * 액세스 토큰 조회
   */
  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * 모든 토큰 제거 (로그아웃 등)
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  /**
   * JWT에서 사용자 정보 추출
   * nickname, profileImage만 전역 상태에 사용
   */
  getUserInfo(): User | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = decodeTokenPayload(token);
    if (!payload) return null;

    return {
      userId: payload.userId,
      nickname: payload.nickname,
      profileImage: payload.profileImage,
    }
  }
}
