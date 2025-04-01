
import axios from 'axios';

// API 기본 설정
const API = axios.create({
  baseURL: 'http://localhost:8080',  // 실제 API 서버 URL로 변경 필요
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 인증 관련 API
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

// 결제 관련 API
export const paymentAPI = {
  // 결제 요청
  savePayment: (paymentData: any) => {
    return API.post('/pay/save', paymentData);
  },
  
  // 결제 내역 조회
  getPaymentHistory: () => {
    return API.get('/pay');
  }
};

export default API;
