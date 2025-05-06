import { useState } from 'react';
import { toast } from 'sonner';
import { authAPI } from '@/api/auth';
import { EmailVerificationResponse } from '@/types/auth';

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
    if (!validateEmail()) return;

    try {
      setIsSendingCode(true);

      const response = await authAPI.sendVerificationCode(email);
      const data = response.data as EmailVerificationResponse;

      toast.success(data.message);

      if (data.message === '이미 인증된 이메일입니다.') {
        setIsEmailVerified(true);
        setIsVerificationModalOpen(false);
      } else {
        // 인증코드가 새로 발송된 경우
        setIsVerificationModalOpen(true);
      }

    } catch (error: any) {
      console.error('인증 코드 발송 실패:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('인증 코드 발송에 실패했습니다.');
      }
    } finally {
      setIsSendingCode(false);
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
    setEmailError,
  };
};
