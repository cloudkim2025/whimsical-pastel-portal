
/**
 * 인증 관련 API 클라이언트 (axios 기반)
 * 
 * - 이메일 인증 코드 전송/검증
 * - 회원가입/로그인/로그아웃
 * - 소셜 연동/계정 정보 수정 등 지원
 * - 모든 http 예외는 try/catch로 응답 data, status 기준 분기 권장
 */
import API from '@/utils/apiClient';

export const authAPI = {
  // 이메일 인증 코드 발송
  sendVerificationCode: (email: string) =>
    API.post('/api/email/send-code', { email }),

  // 이메일 인증 코드 확인
  verifyCode: (email: string, code: string) =>
    API.post('/api/email/verify-code', { email, code }),

  // 회원가입 (폼데이터)
  register: (formData: FormData) =>
    API.post('/auths/join', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // 로그인
  login: ({ email, password }: { email: string; password: string }) =>
    API.post('/auths/login', { email, password }),

  // 강제 로그인
  forceLogin: ({ email, password }: { email: string; password: string }) =>
    API.post('/auths/force-login', { email, password }),

  // 로그아웃
  logout: () => API.delete('/auths/logout'),

  // 내 정보 조회
  getUserInfo: () => API.get('/api/auths/info'),

  // 닉네임 변경
  updateNickname: (nickname: string) =>
    API.put('/api/auths/nickname', { nickname }),

  // 비밀번호 변경
  updatePassword: (currentPassword: string, newPassword: string) =>
    API.put('/api/auths/password', { currentPassword, newPassword }),

  // 프로필 이미지 변경 (폼데이터)
  updateProfileImage: (formData: FormData) =>
    API.put('/api/auths/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // 회원 탈퇴
  deleteAccount: () => API.put('/api/auths/delete'),

  // 소셜 계정 연동
  linkSocialAccount: (accessToken: string, provider: string) =>
    API.post(`/auths/oauth/link?provider=${provider}`, null, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};
