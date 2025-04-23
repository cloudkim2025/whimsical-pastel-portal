
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="w-64 p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
      <div className="flex items-center mb-4">
        <Avatar className="h-10 w-10 border-2 border-ghibli-meadow">
          {user.profileImage ? (
            <AvatarImage src={user.profileImage} alt={user.nickname} />
          ) : (
            <AvatarFallback className="bg-ghibli-earth text-ghibli-forest">
              {user.nickname.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="ml-3">
          <div className="font-medium text-ghibli-forest">{user.nickname}</div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Link to="/profile" className="py-2 px-4 hover:bg-ghibli-cloud rounded-md">
          내 프로필
        </Link>
        <Link to="/settings" className="py-2 px-4 hover:bg-ghibli-cloud rounded-md">
          설정
        </Link>
        <button
          onClick={logout}
          className="w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 rounded-md"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
