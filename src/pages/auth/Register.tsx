
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import RegistrationForm from '@/components/forms/RegistrationForm';

const Register = () => {
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
              Aigongbu의 여정을 함께해요
            </p>
          </div>

          <RegistrationForm />

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
    </div>
  );
};

export default Register;
