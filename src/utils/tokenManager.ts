
export const tokenManager = {
  /**
   * 액세스 토큰 저장
   */
  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  },
  
  /**
   * 액세스 토큰 조회
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },
  
  /**
   * 리프레시 토큰 저장
   */
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  /**
   * 리프레시 토큰 조회
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },
  
  /**
   * 모든 토큰 제거
   */
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  /**
   * 토큰에서 사용자 정보 조회
   */
  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      // JWT 구조: header.payload.signature
      const base64Url = token.split('.')[1]; // payload 부분 추출
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decoding error:', error);
      return null;
    }
  }
};

/**
 * 사용자 역할 조회
 */
export const getUserRole = (): string | null => {
  const userInfo = tokenManager.getUserInfo();
  return userInfo?.role || null;
};

/**
 * 사용자 닉네임 조회
 */
export const getUserNickname = (): string | null => {
  const userInfo = tokenManager.getUserInfo();
  return userInfo?.nickname || null;
};

/**
 * 사용자가 인증되었는지 확인
 */
export const isAuthenticated = (): boolean => {
  const token = tokenManager.getToken();
  if (!token) return false;
  
  // 토큰 만료 체크
  const userInfo = tokenManager.getUserInfo();
  if (!userInfo) return false;
  
  // exp 필드는 Unix timestamp (초 단위)
  const currentTime = Date.now() / 1000;
  return userInfo.exp > currentTime;
};

/**
 * 사용자가 관리자인지 확인
 */
export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === 'ADMIN';
};

/**
 * 사용자가 강사인지 확인
 */
export const isInstructor = (): boolean => {
  const role = getUserRole();
  return role === 'INSTRUCTOR' || role === 'ADMIN';
};

/**
 * 로그아웃 함수
 */
export const logout = () => {
  tokenManager.clearTokens();
};
