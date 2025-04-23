import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI } from '@/api/auth';
import { tokenManager } from '@/utils/tokenManager';
import { LoginRequest, RegisterRequest, UserRole } from '@/types/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 하드코딩 admin 계정 토큰 생성 함수
  const createAdminToken = () => {
    // 실제 JWT가 아닌, 최소한의 가짜 페이로드(기존 토큰 파싱 로직과 맞추기)
    const payload = {
      sub: '1',
      nickname: '관리자',
      profileImage: '',
      role: 'ADMIN',
      // exp: 미래(exp) 포함해도 decodeToken에서 파싱됨
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    // base64 인코딩
    const base64Payload = btoa(
      unescape(encodeURIComponent(JSON.stringify(payload)))
    );
    // JWT는 header.payload.signature(임시로 header/signature dummy)
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.admindummysig`;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // admin 계정 하드코딩
    if (email === 'admin' && password === '123456') {
      const fakeToken = createAdminToken();
      tokenManager.setToken(fakeToken);
      toast.success('관리자 계정으로 로그인 되었습니다!');
      navigate('/admin');
      setIsLoading(false);
      return true;
    }

    try {
      const response = await authAPI.login({ email, password });

      if (response.data.loggedIn && response.data.accessToken) {
        // 토큰을 로컬 스토리지에 저장
        tokenManager.setToken(response.data.accessToken);

        toast.success(response.data.message || '로그인 성공!');

        // 역할에 따라 다른 페이지로 리디렉션
        const userInfo = tokenManager.getUserInfo();
        if (userInfo?.role === 'ADMIN') {
          navigate('/admin');
        } else if (userInfo?.role === 'INSTRUCTOR') {
          navigate('/course-upload');
        } else {
          navigate('/');
        }

        return true;
      } else {
        toast.error(response.data.message || '로그인에 실패했습니다.');
        return false;
      }
    } catch (error: any) {
      console.error('Login failed:', error);

      // 다른 브라우저에서 로그인 중인 경우 (409)
      if (error.response?.status === 409) {
        const confirmForce = window.confirm(error.response.data.message);
        if (confirmForce) {
          return await forceLogin(email, password);
        }
      } else {
        toast.error(error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forceLogin = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await authAPI.forceLogin({ email, password });

      if (response.data.loggedIn && response.data.accessToken) {
        tokenManager.setToken(response.data.accessToken);

        toast.success(response.data.message || '로그인 성공!');

        // 역할에 따라 다른 페이지로 리디렉션
        const userInfo = tokenManager.getUserInfo();
        if (userInfo?.role === 'ADMIN') {
          navigate('/admin');
        } else if (userInfo?.role === 'INSTRUCTOR') {
          navigate('/course-upload');
        } else {
          navigate('/');
        }

        return true;
      } else {
        toast.error(response.data.message || '로그인에 실패했습니다.');
        return false;
      }
    } catch (error: any) {
      console.error('Force login failed:', error);
      toast.error(error.response?.data?.message || '로그인에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const response = await authAPI.register(formData);

      if (response.data.success) {
        // 회원가입 성공 시 자동 로그인될 경우
        if (response.data.accessToken) {
          tokenManager.setToken(response.data.accessToken);
          toast.success(response.data.message || '회원가입 및 로그인 성공!');
          navigate('/');
        } else {
          // 자동 로그인이 안될 경우
          toast.success(response.data.message || '회원가입 성공! 로그인해주세요.');
          navigate('/login');
        }
        return true;
      } else {
        toast.error(response.data.message || '회원가입에 실패했습니다.');
        
        // 유효성 검증 에러가 있는 경우
        if (response.data.errors) {
          if (!response.data.errors.passwordValid) {
            toast.error('비밀번호는 8~20자 사이의 영문, 숫자, 특수문자를 포함해야 합니다.');
          }
          if (!response.data.errors.nicknameValid) {
            toast.error('닉네임은 2~10자 사이의 한글, 영문, 숫자만 사용 가능합니다.');
          }
        }
        
        return false;
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // 에러 코드에 따른 처리
      if (error.response?.status === 409) {
        toast.error('이미 가입된 이메일입니다.');
      } else if (error.response?.status === 422) {
        toast.error('사용할 수 없는 닉네임입니다.');
      } else if (error.response?.status === 401) {
        toast.error('이메일 인증이 완료되지 않았습니다.');
      } else if (error.response?.status === 400 && error.response.data.message.includes('이미지')) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response?.data?.message || '회원가입에 실패했습니다.');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      tokenManager.clearTokens();
      toast.success('로그아웃 되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      tokenManager.clearTokens(); // 에러가 있어도 토큰 제거
      toast.info('로그아웃 되었습니다.');
      navigate('/login');
    }
  };

  const socialLogin = (provider: 'google' | 'naver' | 'kakao') => {
    window.location.href = `/oauth2/authorization/${provider}`;
  };

  return {
    login,
    forceLogin,
    register,
    logout,
    socialLogin,
    isLoading
  };
};
