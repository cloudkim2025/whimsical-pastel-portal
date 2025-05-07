
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Image } from 'lucide-react';
import { toast } from 'sonner';

const ProfileEditForm: React.FC = () => {
  const { user, updateNickname, updateProfileImage, updateUserFromToken } = useAuth();
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return null;
  }

  const handleNicknameEdit = () => {
    setNewNickname(user.nickname);
    setEditingNickname(true);
  };

  const handleNicknameSave = async () => {
    if (!newNickname || newNickname === user.nickname) {
      setEditingNickname(false);
      return;
    }

    // Validate nickname
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
    if (!nicknameRegex.test(newNickname)) {
      toast.error('닉네임은 2~10자 사이의 한글, 영문, 숫자만 사용 가능합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateNickname(newNickname);
      if (success) {
        updateUserFromToken(); // Update user info in the context immediately
        toast.success('닉네임이 변경되었습니다.');
        setEditingNickname(false);
      }
    } catch (error) {
      toast.error('닉네임 변경에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNicknameCancel = () => {
    setEditingNickname(false);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 1024 * 1024) {
      toast.error('프로필 이미지는 최대 1MB까지만 업로드할 수 있습니다.');
      return;
    }

    const fileType = file.type;
    if (!fileType.includes('image/jpeg') && !fileType.includes('image/png')) {
      toast.error('이미지는 JPG, PNG 형식만 가능합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateProfileImage(file);
      if (success) {
        updateUserFromToken(); // Update user info in the context immediately
        toast.success('프로필 이미지가 변경되었습니다.');
      }
    } catch (error) {
      toast.error('프로필 이미지 변경에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col items-center justify-center p-8 bg-ghibli-cloud/20 md:w-1/3">
          <div className="relative group cursor-pointer mb-4" onClick={handleProfileImageClick}>
            <Avatar className="h-32 w-32 border-2 border-ghibli-meadow">
              {user.profileImage ? (
                <AvatarImage src={user.profileImage} alt={user.nickname} />
              ) : (
                <AvatarFallback className="bg-ghibli-cloud text-ghibli-forest text-2xl">
                  {user.nickname.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Image className="h-8 w-8 text-white" />
            </div>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/jpeg, image/png" 
            ref={fileInputRef} 
            onChange={handleProfileImageChange} 
            disabled={isSubmitting}
          />
          <p className="text-center text-sm text-ghibli-stone">프로필 이미지를 클릭하여 변경</p>
        </div>

        <div className="p-8 md:w-2/3">
          <h2 className="text-xl font-bold mb-6 text-ghibli-forest">계정 정보</h2>
          
          <div className="space-y-6">
            {editingNickname ? (
              <div className="space-y-3">
                <label htmlFor="nickname" className="block text-sm font-medium text-ghibli-midnight">
                  새 닉네임
                </label>
                <Input
                  id="nickname"
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="새 닉네임"
                  disabled={isSubmitting}
                  className="border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30"
                />
                <div className="flex space-x-2 mt-2">
                  <Button
                    type="button"
                    onClick={handleNicknameSave}
                    disabled={isSubmitting}
                    className="bg-ghibli-meadow hover:bg-ghibli-forest text-white"
                  >
                    저장
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNicknameCancel}
                    disabled={isSubmitting}
                    variant="outline"
                  >
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ghibli-stone">닉네임</p>
                  <p className="text-lg font-medium">{user.nickname}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNicknameEdit}
                  className="text-ghibli-forest hover:bg-ghibli-cloud"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  수정
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;
