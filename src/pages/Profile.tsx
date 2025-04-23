
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">로그인된 사용자만 접근 가능합니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-14 px-4">
      <h1 className="text-3xl font-bold text-center text-ghibli-forest mb-8">내 프로필</h1>
      <ProfileEditForm />
    </div>
  );
};

export default Profile;
