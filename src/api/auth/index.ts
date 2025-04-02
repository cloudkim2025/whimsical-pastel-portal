
import API from '@/utils/apiClient';

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
  register: (email: string, password: string, nickname: string, role: string = 'USER') => {
    return API.post('/auths/join', { email, password, nickname, role });
  },
  
  // 로그인
  login: (email: string, password: string) => {
    return API.post('/auths/login', { email, password });
  },
  
  // 네이버 로그인 처리
  naverLogin: () => {
    return API.get('/auths/naverlogin');
  }
};
