//navigation/MobileMenuProps

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import SearchModal from '../SearchModal';

interface MobileMenuProps {
  isMenuOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen, onClose }) => {
  const { user, logout } = useAuth(); // ✅ isAuthenticated 제거

  return (
      <div className={cn(
          'md:hidden fixed inset-x-0 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out transform shadow-lg',
          isMenuOpen ? 'top-[calc(100%)] opacity-100' : '-top-[400px] opacity-0'
      )}>
        <div className="px-6 py-4">
          <SearchModal onClose={onClose} />
        </div>

        <nav className="container mx-auto px-6 py-6 flex flex-col space-y-4">
          <Link to="/" className="nav-link text-lg py-2">홈</Link>
          <Link to="/company-info" className="nav-link text-lg py-2">회사정보</Link>
          <Link to="/dev-lectures" className="nav-link text-lg py-2">개발강의</Link>
          <Link to="/ai-lectures" className="nav-link text-lg py-2">AI 강의</Link>
          <Link to="/top-lectures" className="nav-link text-lg py-2">인기강의</Link>

          {user ? ( // ✅ 로그인 여부 판단
              <div className="pt-2 border-t border-ghibli-earth/10">
                <div className="flex items-center space-x-3 p-2">
                  <Avatar className="h-10 w-10 border-2 border-ghibli-meadow">
                    {user.profileImage ? (
                        <AvatarImage src={user.profileImage} alt={user.nickname} />
                    ) : (
                        <AvatarFallback className="bg-ghibli-earth text-ghibli-forest">
                          {user.nickname.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium text-ghibli-forest">{user.nickname}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <Link to="/profile" className="block px-2 py-2 text-ghibli-forest hover:bg-ghibli-cloud rounded-md">
                    내 프로필
                  </Link>
                  <Link to="/settings" className="block px-2 py-2 text-ghibli-forest hover:bg-ghibli-cloud rounded-md">
                    설정
                  </Link>
                  <button
                      className="w-full text-left px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      onClick={logout}
                  >
                    로그아웃
                  </button>
                </div>
              </div>
          ) : (
              <div className="pt-2 border-t border-ghibli-earth/10 flex flex-col space-y-3">
                <Link to="/login" className="py-2.5 px-5 text-ghibli-forest text-center border border-ghibli-meadow hover:bg-ghibli-cloud rounded-full transition-all duration-300">
                  로그인
                </Link>
                <Link to="/register" className="py-2.5 px-5 bg-ghibli-meadow hover:bg-ghibli-forest text-white text-center rounded-full transition-all duration-300">
                  회원가입
                </Link>
              </div>
          )}
        </nav>
      </div>
  );
};

export default MobileMenu;
