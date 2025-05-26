import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { GoogleIcon, NaverIcon, KakaoIcon } from '@/components/icons/SocialIcons';
import type { LoginRequest } from '@/types/auth';
/**
 * 로그인 페이지
 * - 이메일/비밀번호, 소셜 로그인, 에러 UI 모두 명세(OpenAPI) 기반 실제 API 연동
 */
const Login = () => {
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthWithRedirect();
  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
  const redirectUri = encodeURIComponent(import.meta.env.VITE_NAVER_REDIRECT_URI);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(form.email, form.password);
      if (!success) {
        toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  // 소셜 로그인
  const handleSocialLogin = (provider: 'google' | 'naver' | 'kakao') => {
    const state = crypto.randomUUID();
    localStorage.setItem('oauth_state', state);
    if (provider === 'naver') {
      window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
      return;
    }
    // 추후 구글, 카카오 etc 다른 OAuth도 별도 처리
    window.location.href = `/oauth2/authorization/${provider}`;
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
                Aigongbu에 오신 것을 환영합니다
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
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              <div className="mt-6 space-y-3">
                <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-ghibli-earth/30 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-all duration-300"
                >
                  <GoogleIcon className="w-5 h-5" />
                  <span className="text-gray-700 font-medium">Google로 로그인</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSocialLogin('naver')}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-ghibli-earth/30 rounded-lg shadow-sm bg-[#03C75A] hover:bg-[#02AD4F] transition-all duration-300"
                >
                  <NaverIcon className="w-5 h-5" />
                  <span className="text-white font-medium">네이버로 로그인</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSocialLogin('kakao')}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-ghibli-earth/30 rounded-lg shadow-sm bg-[#FEE500] hover:bg-[#FEDB00] transition-all duration-300"
                >
                  <KakaoIcon className="w-5 h-5" />
                  <span className="text-[#3A1D1D] font-medium">카카오로 로그인</span>
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