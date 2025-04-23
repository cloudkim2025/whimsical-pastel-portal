import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">로그인된 사용자만 접근 가능합니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-14">
      <Avatar className="h-24 w-24 border-2 border-ghibli-meadow">
        {user.profileImage ? (
          <AvatarImage src={user.profileImage} alt={user.nickname} />
        ) : (
          <AvatarFallback className="bg-ghibli-cloud text-ghibli-forest text-xl">
            {user.nickname ? user.nickname.slice(0, 2).toUpperCase() : 'UP'}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-ghibli-forest">{user.nickname}</h2>
      </div>
      {/* 프로필 정보 등 추가 */}
    </div>
  );
};

export default Profile;
