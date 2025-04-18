
import API from '@/utils/apiClient';
import { RegisterRequest, LoginRequest } from '@/types/auth';

export const authAPI = {
  // 이메일 인증 코드 발송
  sendVerificationCode: (email: string) => {
    return API.post('/api/email/send-code', { email });
  },
  
  // 이메일 인증 코드 확인
  verifyCode: (email: string, code: string) => {
    return API.post('/api/email/verify-code', { email, code });
  },
  
  // 회원가입 
  register: (formData: FormData) => {
    return API.post('/auths/join', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 로그인
  login: (email: string, password: string) => {
    return API.post('/auths/login', { email, password });
  },
  
  // 강제 로그인 (다른 브라우저에서 이미 로그인된 경우)
  forceLogin: (email: string, password: string) => {
    return API.post('/auths/force-login', { email, password });
  },
  
  // 로그아웃
  logout: () => {
    return API.delete('/auths/logout');
  },
  
  // 토큰 유효성 검증
  validateToken: () => {
    return API.post('/auths/valid-token');
  },
  
  // 토큰 재발급
  refreshToken: () => {
    return API.post('/auths/refresh');
  },
  
  // 소셜 로그인 정보 조회
  getSocialInfo: () => {
    return API.get('/oauth2/info');
  },
  
  // 소셜 계정 연동
  linkSocialAccount: () => {
    return API.post('/oauth2/link');
  }
};
