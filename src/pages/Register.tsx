
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, Home, Check } from 'lucide-react';
import EmailVerificationModal from '@/components/EmailVerificationModal';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    nickname?: string;
  }>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(prev => ({ ...prev, email: '유효한 이메일 주소를 입력해주세요.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: undefined }));
    return true;
  };

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      nickname?: string;
    } = {};
    let isValid = true;

    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
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

  const handleSendVerificationCode = () => {
    if (validateEmail()) {
      // In real app, this would make an API call to send verification code
      toast.success(`${email}로 인증코드가 발송되었습니다.`);
      setIsVerificationModalOpen(true);
    }
  };
  
  const handleVerificationResult = (success: boolean) => {
    if (success) {
      setIsEmailVerified(true);
      toast.success('이메일이 성공적으로 인증되었습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, password, nickname);
      toast.success('회원가입에 성공했습니다!');
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is already handled in the register function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col">
      <div className="container max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-ghibli-meadow/20"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-handwritten text-ghibli-forest mb-2">회원가입</h1>
            <p className="text-ghibli-stone">
              Studio Dreamscape의 여정을 함께해요
            </p>
          </div>

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
                    setIsEmailVerified(false);
                  }}
                  placeholder="your@email.com"
                  required
                  disabled={isEmailVerified}
                  className={`border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                <Button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={isEmailVerified}
                  className={`px-3 whitespace-nowrap ${
                    isEmailVerified
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-ghibli-meadow hover:bg-ghibli-forest'
                  }`}
                >
                  {isEmailVerified ? (
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

          <div className="mt-8 text-center">
            <div className="flex flex-col space-y-3">
              <p className="text-sm text-ghibli-stone">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="text-ghibli-forest hover:underline font-medium">
                  로그인
                </Link>
              </p>
              
              <Link to="/" className="flex items-center justify-center space-x-2 py-2.5 px-5 border border-ghibli-meadow text-ghibli-forest rounded-full hover:bg-ghibli-cloud transition-all duration-300">
                <Home size={18} />
                <span>메인으로 돌아가기</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerificationResult}
        email={email}
      />
    </div>
  );
};

export default Register;
