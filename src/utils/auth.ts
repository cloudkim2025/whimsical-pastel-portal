
/**
 * JWT 토큰 디코딩 함수
 */
export const decodeToken = (token: string) => {
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
};

/**
 * 토큰에서 사용자 역할 추출
 */
export const getUserRole = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const decodedToken = decodeToken(token);
  return decodedToken?.role || null;
};

/**
 * 토큰에서 사용자 닉네임 추출
 */
export const getUserNickname = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const decodedToken = decodeToken(token);
  return decodedToken?.nickname || null;
};

/**
 * 사용자가 인증되었는지 확인
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  // 토큰 만료 체크
  const decodedToken = decodeToken(token);
  if (!decodedToken) return false;

  // exp 필드는 Unix timestamp (초 단위)
  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
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
  localStorage.removeItem('accessToken');
  // 필요 시 다른 로그아웃 처리 추가 가능
};
