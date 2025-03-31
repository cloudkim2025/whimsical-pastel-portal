
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, Home } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithSocialMedia } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      // Error is already handled in the login function
      console.error('Login failed:', error);
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
            <h1 className="text-3xl font-handwritten text-ghibli-forest mb-2">로그인</h1>
            <p className="text-ghibli-stone">
              Studio Dreamscape에 오신 것을 환영합니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-ghibli-midnight">
                  비밀번호
                </label>
                <Link to="/forgot-password" className="text-xs text-ghibli-forest hover:underline">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30"
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-ghibli-meadow hover:bg-ghibli-forest text-white transition-all duration-300"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ghibli-earth/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-ghibli-stone">또는</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="flex justify-center items-center py-2.5 px-4 border border-ghibli-earth/30 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-all duration-300"
              >
                <span className="sr-only">Sign in with Google</span>
                <span className="text-red-500 font-bold text-sm">G</span>
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
            <div className="flex flex-col space-y-3">
              <p className="text-sm text-ghibli-stone">
                계정이 없으신가요?{' '}
                <Link to="/register" className="text-ghibli-forest hover:underline font-medium">
                  회원가입
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
    </div>
  );
};

export default Login;
