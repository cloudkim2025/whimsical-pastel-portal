
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

const ProfileEditForm: React.FC = () => {
  const { user } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Profile update logic would go here
      toast({
        title: "성공",
        description: "프로필이 업데이트되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "프로필 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback>{user?.nickname?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <Label htmlFor="profileImage">프로필 이미지</Label>
          <Input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? '업데이트 중...' : '프로필 업데이트'}
      </Button>
    </form>
  );
};

export default ProfileEditForm;
