
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define types for user and authentication context
export type User = {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  loginWithSocialMedia: (provider: 'google' | 'naver' | 'kakao') => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would make an API call here
      // Mock successful login
      if (email && password) {
        const mockUser: User = {
          id: '123',
          email,
          nickname: email.split('@')[0], // Use part of email as nickname
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + email,
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
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
  const register = async (email: string, password: string, nickname: string) => {
    try {
      // In a real app, you would make an API call here
      // Mock successful registration
      const mockUser: User = {
        id: '123',
        email,
        nickname,
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + email,
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
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
    localStorage.removeItem('user');
    toast.info("로그아웃 되었습니다.");
  };

  // Mock social media login
  const loginWithSocialMedia = (provider: 'google' | 'naver' | 'kakao') => {
    // In a real app, you would redirect to OAuth flow
    toast.info(`${provider} 로그인 준비 중...`);
    
    // Mock successful social login after a delay
    setTimeout(() => {
      const mockUser: User = {
        id: '456',
        email: `user@${provider}.com`,
        nickname: `${provider}User`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}`,
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success(`${provider} 로그인 성공!`);
    }, 1000);
  };

  const value = {
    user,
    isAuthenticated,
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
