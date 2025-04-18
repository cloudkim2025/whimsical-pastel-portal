
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { tokenManager } from '@/utils/tokenManager';
import { authAPI } from '@/api/auth';

// Define types for user and authentication context
export type User = {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  role?: 'ADMIN' | 'INSTRUCTOR' | 'USER';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isInstructor: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (formData: FormData) => Promise<boolean>;
  logout: () => void;
  loginWithSocialMedia: (provider: 'google' | 'naver' | 'kakao') => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInstructor, setIsInstructor] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // 토큰 유효성 검증 및 사용자 정보 설정
  const checkAuthentication = async () => {
    const token = tokenManager.getToken();
    if (!token) return;
    
    try {
      // 토큰 유효성 검증 API 호출
      const response = await authAPI.validateToken();
      
      if (response.data.isValid) {
        const userInfo = tokenManager.getUserInfo();
        if (userInfo) {
          setUser({
            id: userInfo.sub || '',
            email: userInfo.email || '',
            nickname: userInfo.nickname || '',
            avatar: userInfo.profileImage,
            role: userInfo.role
          });
          setIsAuthenticated(true);
          setIsInstructor(['INSTRUCTOR', 'ADMIN'].includes(userInfo.role));
          setIsAdmin(userInfo.role === 'ADMIN');
        }
      } else {
        // 토큰이 만료되었으면 갱신 시도
        try {
          const refreshResponse = await authAPI.refreshToken();
          if (refreshResponse.data.success && refreshResponse.data.accessToken) {
            tokenManager.setToken(refreshResponse.data.accessToken);
            checkAuthentication(); // 갱신 후 다시 인증 체크
          } else {
            handleLogout();
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Token validation error:', error);
      // 토큰 검증 실패 시 로그아웃 처리
      handleLogout();
    }
  };

  // Check if user is already logged in (from token)
  useEffect(() => {
    checkAuthentication();
  }, []);

  // 실제 API 로그인 함수
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // API 로그인 시도
      const response = await authAPI.login(email, password);
      
      if (response.data.loggedIn && response.data.accessToken) {
        const token = response.data.accessToken;
        tokenManager.setToken(token);
        
        // refreshToken이 있으면 저장
        if (response.data.refreshToken) {
          tokenManager.setRefreshToken(response.data.refreshToken);
        }
        
        // 토큰 디코딩
        const userInfo = tokenManager.getUserInfo();
        
        if (userInfo) {
          const user: User = {
            id: userInfo.sub || '',
            email: userInfo.email || email,
            nickname: userInfo.nickname || email.split('@')[0],
            avatar: userInfo.profileImage,
            role: userInfo.role
          };
          
          setUser(user);
          setIsAuthenticated(true);
          setIsInstructor(['INSTRUCTOR', 'ADMIN'].includes(userInfo.role));
          setIsAdmin(userInfo.role === 'ADMIN');
          
          toast.success(response.data.message || "로그인 성공!");
          return true;
        }
      } 
      
      return false;
    } catch (error: any) {
      // 로그인 실패 시 에러 처리는 호출자에게 위임
      throw error;
    }
  };

  // 회원가입 함수
  const register = async (formData: FormData): Promise<boolean> => {
    try {
      // API 회원가입 시도
      const response = await authAPI.register(formData);
      
      if (response.data.success) {
        // 회원가입 성공 시 자동 로그인 (accessToken이 있는 경우)
        if (response.data.accessToken) {
          tokenManager.setToken(response.data.accessToken);
          
          const userInfo = tokenManager.getUserInfo();
          if (userInfo) {
            setUser({
              id: userInfo.sub || '',
              email: userInfo.email || '',
              nickname: userInfo.nickname || '',
              avatar: userInfo.profileImage,
              role: userInfo.role
            });
            setIsAuthenticated(true);
            setIsInstructor(['INSTRUCTOR', 'ADMIN'].includes(userInfo.role));
            setIsAdmin(userInfo.role === 'ADMIN');
          }
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      // 회원가입 실패 시 에러 처리는 호출자에게 위임
      throw error;
    }
  };

  // Logout function
  const handleLogout = () => {
    tokenManager.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    setIsInstructor(false);
    setIsAdmin(false);
  };
  
  // API 통합 로그아웃
  const logout = async () => {
    try {
      await authAPI.logout();
      handleLogout();
      toast.success("로그아웃 되었습니다.");
    } catch (error) {
      console.error('Logout error:', error);
      handleLogout();
      toast.info("로그아웃 되었습니다.");
    }
  };

  // 소셜 로그인
  const loginWithSocialMedia = (provider: 'google' | 'naver' | 'kakao') => {
    window.location.href = `/oauth2/authorization/${provider}`;
  };

  const value = {
    user,
    isAuthenticated,
    isInstructor,
    isAdmin,
    login,
    register,
    logout,
    loginWithSocialMedia,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
