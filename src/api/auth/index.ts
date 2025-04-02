
import API from '@/utils/apiClient';

// 테스트용 계정 정보
const TEST_ACCOUNTS = {
  instructor: {
    email: 'instructor@example.com',
    password: '123456',
    nickname: 'Instructor',
    role: 'INSTRUCTOR'
  },
  admin: {
    email: 'manager@example.com',
    password: '123456',
    nickname: 'Manager',
    role: 'ADMIN'
  }
};

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
  
  // 로그인 - 테스트 계정 기능 추가
  login: (email: string, password: string) => {
    // 테스트 계정 로그인 처리
    if (email === TEST_ACCOUNTS.instructor.email && password === TEST_ACCOUNTS.instructor.password) {
      // 강사 계정 로그인 성공 처리
      const token = generateMockToken(TEST_ACCOUNTS.instructor);
      return Promise.resolve({
        data: {
          loggedIn: true,
          accessToken: token,
          message: '강사 계정으로 로그인되었습니다.'
        }
      });
    } 
    
    if (email === TEST_ACCOUNTS.admin.email && password === TEST_ACCOUNTS.admin.password) {
      // 관리자 계정 로그인 성공 처리
      const token = generateMockToken(TEST_ACCOUNTS.admin);
      return Promise.resolve({
        data: {
          loggedIn: true,
          accessToken: token,
          message: '관리자 계정으로 로그인되었습니다.'
        }
      });
    }
    
    // 일반 API 로그인 요청 (기존 코드)
    return API.post('/auths/login', { email, password });
  },
  
  // 네이버 로그인 처리
  naverLogin: () => {
    return API.get('/auths/naverlogin');
  }
};

// 테스트 계정용 토큰 생성
function generateMockToken(user: any) {
  // 실제 토큰 대신 인코딩된 JWT 형태의 문자열 생성
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const currentTime = Math.floor(Date.now() / 1000);
  
  const payload = btoa(JSON.stringify({
    sub: `user-${Date.now()}`,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
    iat: currentTime,
    exp: currentTime + 86400 // 24시간 유효
  }));
  
  const signature = btoa('mockSignature');
  
  return `${header}.${payload}.${signature}`;
}
