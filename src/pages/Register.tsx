
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Google, Mail } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    nickname?: string;
  }>({});
  
  const { register, loginWithSocialMedia } = useAuth();
  const navigate = useNavigate();

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

  const handleSocialLogin = (provider: 'google' | 'naver' | 'kakao') => {
    loginWithSocialMedia(provider);
    // Redirect will happen after successful login via context effect
    setTimeout(() => navigate('/'), 1500);
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
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className={`w-full border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
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
              disabled={isLoading}
              className="w-full bg-ghibli-meadow hover:bg-ghibli-forest text-white transition-all duration-300 mt-6"
            >
              {isLoading ? '회원가입 중...' : '회원가입'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ghibli-earth/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-ghibli-stone">또는 소셜 미디어로 가입</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="flex justify-center items-center py-2.5 px-4 border border-ghibli-earth/30 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-all duration-300"
              >
                <span className="sr-only">Sign in with Google</span>
                <Google className="h-5 w-5 text-red-500" />
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('naver')}
                className="flex justify-center items-center py-2.5 px-4 border border-ghibli-earth/30 rounded-md shadow-sm bg-[#03C75A] hover:bg-[#02AD4F] transition-all duration-300"
              >
                <span className="sr-only">Sign in with Naver</span>
                <span className="text-white font-bold text-sm">N</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('kakao')}
                className="flex justify-center items-center py-2.5 px-4 border border-ghibli-earth/30 rounded-md shadow-sm bg-[#FEE500] hover:bg-[#FEDB00] transition-all duration-300"
              >
                <span className="sr-only">Sign in with Kakao</span>
                <span className="text-[#3A1D1D] font-bold text-sm">K</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-ghibli-stone">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-ghibli-forest hover:underline font-medium">
                로그인
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
