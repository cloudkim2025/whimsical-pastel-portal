
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterRequest } from '@/types/auth';
import type { FormErrors } from '@/components/forms/RegistrationForm.types';

/**
 * 인증 성공 후 메인/목표 경로로 라우팅을 자동 처리하는 커스텀 훅
 */
export const useAuthWithRedirect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    login,
    forceLogin,
    register,
    logout,
    loginWithSocialMedia,
  } = useAuth();

  const loginWithRedirect = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await login(email, password, () => navigate('/'));
    } finally {
      setIsLoading(false);
    }
  };

  const forceLoginWithRedirect = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await forceLogin(email, password, () => navigate('/'));
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithRedirect = async (
    form: RegisterRequest,
    onMessage?: (field: keyof FormErrors, message: string) => void,
    setErrors?: React.Dispatch<React.SetStateAction<FormErrors>>
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await register(
        form,
        onMessage,
        setErrors
      );
      if (success) {
        navigate('/');
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login: loginWithRedirect,
    forceLogin: forceLoginWithRedirect,
    register: registerWithRedirect,
    logout,
    loginWithSocialMedia,
    isLoading,
  };
};
