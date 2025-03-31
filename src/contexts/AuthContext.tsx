
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define types for user and authentication context
export type User = {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  role?: 'student' | 'instructor' | 'admin';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isInstructor: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string, role?: 'student' | 'instructor') => Promise<void>;
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

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsInstructor(parsedUser.role === 'instructor' || parsedUser.role === 'admin');
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would make an API call here
      // Mock successful login
      if (email && password) {
        // 특정 이메일은 강사로 설정 (데모용)
        const isInstructorEmail = email.includes('instructor') || email.includes('teacher');
        
        const mockUser: User = {
          id: '123',
          email,
          nickname: email.split('@')[0], // Use part of email as nickname
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + email,
          role: isInstructorEmail ? 'instructor' : 'student'
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        setIsInstructor(isInstructorEmail);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast.success("로그인 성공!");
        return;
      }
      throw new Error('로그인 정보가 올바르지 않습니다.');
    } catch (error) {
      toast.error("로그인에 실패했습니다.");
      throw error;
    }
  };

  // Mock register function
  const register = async (email: string, password: string, nickname: string, role: 'student' | 'instructor' = 'student') => {
    try {
      // In a real app, you would make an API call here
      // Mock successful registration
      const mockUser: User = {
        id: '123',
        email,
        nickname,
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + email,
        role
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsInstructor(role === 'instructor');
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success("회원가입 성공!");
    } catch (error) {
      toast.error("회원가입에 실패했습니다.");
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsInstructor(false);
    localStorage.removeItem('user');
    toast.info("로그아웃 되었습니다.");
  };

  // Mock social media login
  const loginWithSocialMedia = (provider: 'google' | 'naver' | 'kakao') => {
    // In a real app, you would redirect to OAuth flow
    toast.info(`${provider} 로그인 준비 중...`);
    
    // Mock successful social login after a delay
    setTimeout(() => {
      // Kakao 로그인은 강사로 설정 (데모용)
      const isInstructor = provider === 'kakao';
      
      const mockUser: User = {
        id: '456',
        email: `user@${provider}.com`,
        nickname: `${provider}User`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}`,
        role: isInstructor ? 'instructor' : 'student'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsInstructor(isInstructor);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success(`${provider} 로그인 성공!`);
    }, 1000);
  };

  const value = {
    user,
    isAuthenticated,
    isInstructor,
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
