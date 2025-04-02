
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI } from '@/api/auth';
import { tokenManager } from '@/utils/tokenManager';
import { LoginRequest, RegisterRequest } from '@/types/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      
      if (response.data.loggedIn && response.data.accessToken) {
        // 토큰을 로컬 스토리지에 저장
        tokenManager.setToken(response.data.accessToken);
        
        if (response.data.refreshToken) {
          tokenManager.setRefreshToken(response.data.refreshToken);
        }
        
        toast.success('로그인 성공!');
        navigate('/');
        return true;
      } else {
        toast.error('로그인에 실패했습니다.');
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: RegisterRequest) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.register(
        registerData.email, 
        registerData.password, 
        registerData.nickname,
        registerData.role || 'USER'
      );
      
      if (response.data.isSuccess) {
        toast.success(response.data.message || '가입이 완료되었습니다.');
        navigate('/login');
        return true;
      } else {
        toast.error(response.data.message || '회원가입에 실패했습니다.');
        return false;
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.message || '회원가입에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenManager.clearTokens();
    toast.success('로그아웃 되었습니다.');
    navigate('/login');
  };

  const socialLogin = (provider: 'google' | 'naver' | 'kakao') => {
    if (provider === 'naver') {
      window.location.href = '/oauth2/authorization/naver';
    } else if (provider === 'google') {
      window.location.href = '/oauth2/authorization/google';
    } else if (provider === 'kakao') {
      window.location.href = '/oauth2/authorization/kakao';
    }
  };

  return {
    login,
    register,
    logout,
    socialLogin,
    isLoading
  };
};
