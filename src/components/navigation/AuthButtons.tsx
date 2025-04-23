//navigation/AuthButtons

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthButtons: React.FC = () => {
    const { user } = useAuth(); // ✅ user로 변경

    // 로그인 상태면 버튼 숨김
    if (user) {
        return null;
    }

    return (
        <div className="flex items-center space-x-4">
            <Link
                to="/login"
                className="py-2.5 px-5 text-ghibli-forest border border-ghibli-meadow hover:bg-ghibli-cloud rounded-full transition-all duration-300"
            >
                로그인
            </Link>
            <Link
                to="/register"
                className="py-2.5 px-5 bg-ghibli-meadow hover:bg-ghibli-forest text-white rounded-full transition-all duration-300"
            >
                회원가입
            </Link>
        </div>
    );
};

export default AuthButtons;
