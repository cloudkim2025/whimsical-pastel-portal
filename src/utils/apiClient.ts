
import axios from 'axios';
import { tokenManager } from './tokenManager';

const API = axios.create({
  baseURL: 'http://localhost:9000',  // Edge-service gateway 주소 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000 // 10초
});

// 요청 인터셉터 - 토큰 추가
API.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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
    
    // 401 에러이고 토큰 만료인 경우 리프레시 토큰으로 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 토큰 갱신 로직 (실제 백엔드 API에 맞게 수정 필요)
        // const refreshToken = tokenManager.getRefreshToken();
        // const response = await API.post('/auths/refresh-token', { refreshToken });
        // const newToken = response.data.accessToken;
        // tokenManager.setToken(newToken);
        // originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        // return API(originalRequest);
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
