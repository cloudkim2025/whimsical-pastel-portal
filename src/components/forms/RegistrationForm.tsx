
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authAPI } from '@/services/api';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import EmailVerificationModal from '@/components/EmailVerificationModal';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  nickname?: string;
}

const RegistrationForm: React.FC = () => {
  const {
    email,
    setEmail,
    isEmailVerified,
    isSendingCode,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    handleSendVerificationCode,
    handleVerificationResult,
    emailError,
    setEmailError
  } = useEmailVerification();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Email validation is handled in the hook
    if (emailError || !email) {
      newErrors.email = emailError || '이메일 주소를 입력해주세요.';
      isValid = false;
    }

    // Email verification check
    if (!isEmailVerified) {
      newErrors.email = '이메일 인증이 필요합니다.';
      isValid = false;
    }

    // Password validation
    if (!password || password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    // Nickname validation
    if (!nickname || nickname.length < 2) {
      newErrors.nickname = '닉네임은 최소 2자 이상이어야 합니다.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // API를 통한 회원가입 요청
      const response = await authAPI.register(email, password, nickname);
      
      if (response.data.isSuccess) {
        toast.success(response.data.message || '회원가입에 성공했습니다!');
        navigate('/login');
      } else {
        toast.error(response.data.message || '회원가입에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-ghibli-midnight">
            이메일
          </label>
          <div className="flex space-x-2">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="your@email.com"
              required
              disabled={isEmailVerified}
              className={`border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30 ${
                errors.email ? 'border-red-500' : isEmailVerified ? 'border-green-500' : ''
              }`}
            />
            <Button
              type="button"
              onClick={handleSendVerificationCode}
              disabled={isEmailVerified || isSendingCode}
              className={`px-3 whitespace-nowrap ${
                isEmailVerified
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-ghibli-meadow hover:bg-ghibli-forest'
              }`}
            >
              {isSendingCode ? (
                '발송중...'
              ) : isEmailVerified ? (
                <>
                  <Check className="h-4 w-4 mr-1" /> 인증됨
                </>
              ) : (
                '인증하기'
              )}
            </Button>
          </div>
          {errors.email ? (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          ) : isEmailVerified ? (
            <p className="text-xs text-green-600 mt-1">이메일이 인증되었습니다.</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="nickname" className="block text-sm font-medium text-ghibli-midnight">
            닉네임
          </label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="dreamscaper"
            required
            className={`w-full border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30 ${
              errors.nickname ? 'border-red-500' : ''
            }`}
          />
          {errors.nickname && (
            <p className="text-xs text-red-500 mt-1">{errors.nickname}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-ghibli-midnight">
            비밀번호
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`w-full border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30 ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ghibli-midnight">
            비밀번호 확인
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`w-full border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30 ${
              errors.confirmPassword ? 'border-red-500' : ''
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <Button 
          type="submit"
          disabled={isLoading || !isEmailVerified}
          className="w-full bg-ghibli-meadow hover:bg-ghibli-forest text-white transition-all duration-300 mt-6"
        >
          {isLoading ? '회원가입 중...' : '회원가입'}
        </Button>
      </form>

      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerificationResult}
        email={email}
      />
    </>
  );
};

export default RegistrationForm;
