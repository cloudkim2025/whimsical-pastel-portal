
import { useState } from 'react';
import { toast } from 'sonner';
import { authAPI } from '@/services/api';

interface UseEmailVerificationReturn {
  email: string;
  setEmail: (email: string) => void;
  isEmailVerified: boolean;
  isSendingCode: boolean;
  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (isOpen: boolean) => void;
  handleSendVerificationCode: () => Promise<void>;
  handleVerificationResult: (success: boolean) => void;
  validateEmail: () => boolean;
  emailError?: string;
  setEmailError: (error?: string) => void;
}

export const useEmailVerification = (): UseEmailVerificationReturn => {
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();

  const validateEmail = (): boolean => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
      return false;
    }
    setEmailError(undefined);
    return true;
  };

  const handleSendVerificationCode = async (): Promise<void> => {
    if (validateEmail()) {
      try {
        setIsSendingCode(true);
        
        // API 호출로 인증 코드 발송
        const response = await authAPI.sendVerificationCode(email);
        
        toast.success(`${email}로 인증코드가 발송되었습니다.`);
        setIsVerificationModalOpen(true);
      } catch (error) {
        console.error('Failed to send verification code:', error);
        toast.error('인증 코드 발송에 실패했습니다.');
      } finally {
        setIsSendingCode(false);
      }
    }
  };
  
  const handleVerificationResult = (success: boolean): void => {
    if (success) {
      setIsEmailVerified(true);
      toast.success('이메일이 성공적으로 인증되었습니다.');
    }
  };

  return {
    email,
    setEmail,
    isEmailVerified,
    isSendingCode,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    handleSendVerificationCode,
    handleVerificationResult,
    validateEmail,
    emailError,
    setEmailError
  };
};
