
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { authAPI } from '@/api/auth';
import { decodeToken, getUserRole, isAuthenticated, logout as authLogout } from '@/utils/auth';

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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string, role?: 'USER' | 'INSTRUCTOR') => Promise<void>;
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

  // Check if user is already logged in (from token)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUser({
          id: decodedToken.sub || '',
          email: decodedToken.email || '',
          nickname: decodedToken.nickname || '',
          role: decodedToken.role
        });
        setIsAuthenticated(true);
        setIsInstructor(['INSTRUCTOR', 'ADMIN'].includes(decodedToken.role));
        setIsAdmin(decodedToken.role === 'ADMIN');
      }
    }
  }, []);

  // 실제 API 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      // API 로그인 시도
      const response = await authAPI.login(email, password);
      
      if (response.data.loggedIn && response.data.accessToken) {
        const token = response.data.accessToken;
        localStorage.setItem('accessToken', token);
        
        // 토큰 디코딩
        const decodedToken = decodeToken(token);
        
        if (decodedToken) {
          const userRole = decodedToken.role;
          
          const user: User = {
            id: decodedToken.sub || '',
            email: decodedToken.email || email,
            nickname: decodedToken.nickname || email.split('@')[0],
            role: userRole
          };
          
          setUser(user);
          setIsAuthenticated(true);
          setIsInstructor(['INSTRUCTOR', 'ADMIN'].includes(userRole));
          setIsAdmin(userRole === 'ADMIN');
          
          // 강사 또는 관리자 로그인 시 특별한 메시지 표시
          if (userRole === 'INSTRUCTOR') {
            toast.success("강사 계정으로 로그인 되었습니다!");
          } else if (userRole === 'ADMIN') {
            toast.success("관리자 계정으로 로그인 되었습니다!");
          } else {
            toast.success("로그인 성공!");
          }
        }
      } else {
        throw new Error('로그인 정보가 올바르지 않습니다.');
      }
    } catch (error) {
      toast.error("로그인에 실패했습니다.");
      throw error;
    }
  };

  // 회원가입 함수
  const register = async (email: string, password: string, nickname: string, role: 'USER' | 'INSTRUCTOR' = 'USER') => {
    try {
      // API 회원가입 시도
      const response = await authAPI.register(email, password, nickname, role);
      
      if (response.data.isSuccess) {
        toast.success(response.data.message || "회원가입 성공!");
      } else {
        toast.error(response.data.message || "회원가입에 실패했습니다.");
        throw new Error(response.data.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      toast.error("회원가입에 실패했습니다.");
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
    setIsInstructor(false);
    setIsAdmin(false);
    toast.info("로그아웃 되었습니다.");
  };

  // 소셜 로그인
  const loginWithSocialMedia = (provider: 'google' | 'naver' | 'kakao') => {
    if (provider === 'naver') {
      // 네이버 로그인 리다이렉션
      window.location.href = '/oauth2/authorization/naver';
    } else {
      // 기타 소셜 로그인 (데모)
      toast.info(`${provider} 로그인 준비 중...`);
      
      // 데모 소셜 로그인 (실제로는 제거하고 리다이렉션만 처리)
      setTimeout(() => {
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NTYiLCJlbWFpbCI6InVzZXJAJHtwcm92aWRlcn0uY29tIiwibmlja25hbWUiOiIke3Byb3ZpZGVyfVVzZXIiLCJyb2xlIjoiVVNFUiIsImV4cCI6MTkxNjIzOTAyMn0.NIP6oGJVsls-D-J8JmsCFXEUxsNGBzUYlwPjouvQVm0`;
        localStorage.setItem('accessToken', mockToken);
        
        const user: User = {
          id: '456',
          email: `user@${provider}.com`,
          nickname: `${provider}User`,
          role: provider === 'kakao' ? 'INSTRUCTOR' : 'USER'
        };
        
        setUser(user);
        setIsAuthenticated(true);
        setIsInstructor(provider === 'kakao');
        setIsAdmin(false);
        toast.success(`${provider} 로그인 성공!`);
      }, 1000);
    }
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
