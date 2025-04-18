
import axios from 'axios';
import { tokenManager } from './tokenManager';

const API = axios.create({
  baseURL: 'http://localhost:9000',  // Edge-service gateway 주소 (필요시 수정)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초
  withCredentials: true, // 쿠키 전송을 위해 필요
});

// 요청 인터셉터 - 토큰 추가
API.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // FormData인 경우 Content-Type을 자동으로 처리하도록 설정
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리 및 토큰 갱신
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 에러 상세 정보 콘솔에 기록 (디버깅용)
    console.error('API 오류 발생:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    // 401 에러이고 토큰 만료인 경우 리프레시 토큰으로 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 토큰 갱신 API 호출
        const response = await API.post('/auths/refresh');
        
        if (response.data.success && response.data.accessToken) {
          const newToken = response.data.accessToken;
          tokenManager.setToken(newToken);
          
          // 원래 요청의 헤더에 새 토큰 설정
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          // 원래 요청 다시 실행
          return API(originalRequest);
        } else {
          // 갱신 실패 시 로그아웃
          tokenManager.clearTokens();
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
