
import React, {createContext, type ReactNode, useContext, useEffect, useState,} from 'react';
import {toast} from 'sonner';
import {tokenManager} from '@/utils/tokenManager';
import {authAPI} from '@/api/auth';
import type {RegisterRequest, User} from '@/types/auth';
import {FormErrors} from "@/components/forms/RegistrationForm.types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, onSuccess?: () => void) => Promise<boolean>;
  forceLogin: (email: string, password: string, onSuccess?: () => void) => Promise<boolean>;
  register: (
      form: RegisterRequest,
      onMessage?: (field: keyof FormErrors, message: string) => void,
      setErrors?: React.Dispatch<React.SetStateAction<FormErrors>>
  ) => Promise<boolean>;
  logout: () => void;
  loginWithSocialMedia: (provider: 'google' | 'naver' | 'kakao') => void;
  updateUserFromToken: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  updateNickname: (nickname: string) => Promise<boolean>;
  updateProfileImage: (image: File) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isInstructor, setIsInstructor] = useState<boolean>(false);

  const updateUserFromToken = () => {
    const userInfo = tokenManager.getUserInfo();
    setUser(userInfo || null);
  };

  // Check user role on initial render and when user changes
  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const { data } = await authAPI.getUserRole();
          const role = data.role;
          setIsAdmin(role === 'ADMIN');
          setIsInstructor(role === 'ADMIN' || role === 'INSTRUCTOR');
        } catch (error) {
          console.error('Failed to check user role:', error);
          setIsAdmin(false);
          setIsInstructor(false);
        }
      } else {
        setIsAdmin(false);
        setIsInstructor(false);
      }
    };

    checkUserRole();
  }, [user]);

  useEffect(() => {
    if (tokenManager.getToken()) {
      updateUserFromToken();
    }
  }, []);

  const login = async (
      email: string,
      password: string,
      onSuccess?: () => void
  ): Promise<boolean> => {
    try {
      // ==========================
      // [임시] 관리자 하드코딩 계정용
      // email: admin / pw: 123456
      // ==========================
      if (email === 'admin' && password === '123456') {
        // 별도의 토큰 발급 없이 로그인 처리
        const adminToken = createAdminToken();
        tokenManager.setToken(adminToken);
        updateUserFromToken();
        toast.success('[임시계정] 관리자로 테스트 로그인 되었습니다.');
        onSuccess?.();
        return true;
      }

      const { data } = await authAPI.login({ email, password });

      if (data?.loggedIn && data.accessToken) {
        tokenManager.setToken(data.accessToken);
        updateUserFromToken();
        toast.success(data.message || '로그인 성공!');
        onSuccess?.();
        return true;
      }

      toast.error(data.message || '로그인에 실패했습니다.');
      return false;
    } catch (error: any) {
      const status = error.response?.status;
      const msg = error.response?.data?.message;

      if (status === 409) {
        toast.error('해당 계정은 다른 브라우저나 기기에서 로그인된 상태입니다. 지금 로그인하면 기존 세션은 만료됩니다. 계속하시겠습니까?');
      } else {
        toast.error(msg || '로그인 중 오류가 발생했습니다.');
      }
      return false;
    }
  };

  // 하드코딩 admin 계정 토큰 생성 함수
  const createAdminToken = () => {
    // 실제 JWT가 아닌, 최소한의 가짜 페이로드(기존 토큰 파싱 로직과 맞추기)
    const payload = {
      sub: '1',
      nickname: '관리자',
      profileImage: '',
      role: 'ADMIN',
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    // base64 인코딩
    const base64Payload = btoa(
      unescape(encodeURIComponent(JSON.stringify(payload)))
    );
    // JWT는 header.payload.signature(임시로 header/signature dummy)
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.admindummysig`;
  };

  const forceLogin = async (
      email: string,
      password: string,
      onSuccess?: () => void
  ): Promise<boolean> => {
    try {
      const { data } = await authAPI.forceLogin({ email, password });
      if (data.loggedIn && data.accessToken) {
        tokenManager.setToken(data.accessToken);
        updateUserFromToken();
        toast.success(data.message || '강제 로그인 성공!');
        onSuccess?.();
        return true;
      }
      toast.error(data.message || '강제 로그인 실패');
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || '강제 로그인 중 오류가 발생했습니다.');
      return false;
    }
  };

  const register = async (
      form: RegisterRequest,
      onMessage?: (field: keyof FormErrors, message: string) => void,
      setErrors?: React.Dispatch<React.SetStateAction<FormErrors>>
  ): Promise<boolean> => {
    try {
      const formData = new FormData();
      const userPayload = {
        email: form.email,
        password: form.password,
        nickname: form.nickname,
      };

      formData.append('user', new Blob([JSON.stringify(userPayload)], { type: 'application/json' }));

      if (form.profileImage) {
        formData.append('profileImage', form.profileImage);
      }

      const { data } = await authAPI.register(formData);

      if (data?.success) {
        if (data.accessToken) {
          tokenManager.setToken(data.accessToken);
          updateUserFromToken();
        }
        toast.success(data.message || '회원가입 성공!');
        return true;
      }

      if (data.errors && setErrors) {
        setErrors((prev) => ({
          ...prev,
          ...data.errors,
        }));
      }

      if (!data.errors && data.message && onMessage) {
        onMessage('nicknameError', data.message);
      }

      toast.error(data.message || '회원가입에 실패했습니다.');
      return false;
    } catch (error: any) {
      const responseData = error?.response?.data;

      if (responseData?.errors && setErrors) {
        setErrors((prev) => ({
          ...prev,
          ...responseData.errors,
        }));
      }

      if (!responseData?.errors && responseData?.message && onMessage) {
        onMessage('nicknameError', responseData.message);
      }

      toast.error(responseData?.message || '회원가입 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateNickname = async (nickname: string): Promise<boolean> => {
    try {
      // 관리자 하드코딩 계정인 경우 특별 처리
      if (user?.nickname === '관리자' && user?.sub === '1') {
        // 관리자 토큰 재생성
        const payload = {
          sub: '1',
          nickname: nickname,
          profileImage: user.profileImage || '',
          role: 'ADMIN',
          exp: Math.floor(Date.now() / 1000) + 3600,
        };
        
        const base64Payload = btoa(
          unescape(encodeURIComponent(JSON.stringify(payload)))
        );
        
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.admindummysig`;
        tokenManager.setToken(token);
        updateUserFromToken();
        toast.success('닉네임이 성공적으로 변경되었습니다.');
        return true;
      }

      const response = await authAPI.updateNickname(nickname);
      if (response.data?.success) {
        // Get the new token from the response if it exists
        if (response.data.accessToken) {
          tokenManager.setToken(response.data.accessToken);
        }
        updateUserFromToken(); // Update user info from token
        toast.success('닉네임이 성공적으로 변경되었습니다.');
        return true;
      }
      toast.error(response.data?.message || '닉네임 변경에 실패했습니다.');
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || '닉네임 변경 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateProfileImage = async (image: File): Promise<boolean> => {
    try {
      // 관리자 하드코딩 계정인 경우 특별 처리
      if (user?.nickname === '관리자' && user?.sub === '1') {
        // 이미지를 base64로 변환하여 관리자 토큰에 저장
        const reader = new FileReader();
        
        return new Promise((resolve) => {
          reader.onloadend = () => {
            const base64Image = reader.result as string;
            
            // 관리자 토큰 재생성 (이미지 포함)
            const payload = {
              sub: '1',
              nickname: user.nickname,
              profileImage: base64Image,
              role: 'ADMIN',
              exp: Math.floor(Date.now() / 1000) + 3600,
            };
            
            const base64Payload = btoa(
              unescape(encodeURIComponent(JSON.stringify(payload)))
            );
            
            const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.admindummysig`;
            tokenManager.setToken(token);
            updateUserFromToken();
            toast.success('프로필 이미지가 성공적으로 변경되었습니다.');
            resolve(true);
          };
          
          reader.onerror = () => {
            toast.error('이미지 변환 중 오류가 발생했습니다.');
            resolve(false);
          };
          
          reader.readAsDataURL(image);
        });
      }

      const formData = new FormData();
      formData.append('profileImage', image);

      const response = await authAPI.updateProfileImage(formData);
      if (response.data?.success) {
        // Get the new token from the response if it exists
        if (response.data.accessToken) {
          tokenManager.setToken(response.data.accessToken);
        }
        updateUserFromToken(); // Update user info from token
        toast.success('프로필 이미지가 성공적으로 변경되었습니다.');
        return true;
      }
      toast.error(response.data?.message || '프로필 이미지 변경에 실패했습니다.');
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || '프로필 이미지 변경 중 오류가 발생했습니다.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
      setUser(null);
      setIsAdmin(false);
      setIsInstructor(false);
      toast.info('로그아웃 되었습니다.');
    }
  };

  const loginWithSocialMedia = (provider: 'google' | 'naver' | 'kakao') => {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    window.location.href = `/oauth2/authorization/${provider}?state=${state}`;
  };

  const value: AuthContextType = {
    user,
    login,
    forceLogin,
    register,
    logout,
    loginWithSocialMedia,
    updateUserFromToken,
    isAuthenticated: !!user,
    isAdmin,
    isInstructor,
    updateNickname,
    updateProfileImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
