import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {verificationAPI} from "@/api";

const categories = [
  { id: 'frontend', name: '프론트엔드' },
  { id: 'backend', name: '백엔드' },
  { id: 'mobile', name: '모바일' },
  { id: 'ai', name: 'AI/머신러닝' },
  { id: 'devops', name: 'DevOps' },
  { id: 'database', name: '데이터베이스' },
  { id: 'security', name: '보안' },
  { id: 'cloud', name: '클라우드' },
  { id: 'ui-ux', name: 'UI/UX' },
  { id: 'other', name: '기타' },
];

const InstructorApplicationForm: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: '파일 크기 제한',
        description: '이력서 파일은 10MB 이하여야 합니다.',
      });
      return;
    }
    setResume(file);
    setResumeName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !introduction || !category || !profileImage || !resume) {
      toast({
        variant: 'destructive',
        title: '입력 오류',
        description: '모든 항목을 입력해주세요.',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // FormData 생성 및 API 호출
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', introduction);
      formData.append('category', category);
      formData.append('profileImage', profileImage);
      formData.append('resume', resume);
      await verificationAPI.applyForTeacher(formData);

      toast({
        title: '지원서 제출 완료',
        description: '강사 지원서가 성공적으로 제출되었습니다. 심사 후 결과를 알려드리겠습니다.',
      });
      // 초기화
      setName('');
      setIntroduction('');
      setProfileImage(null);
      setProfilePreview(null);
      setCategory('');
      setResume(null);
      setResumeName('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '제출 실패',
        description: error?.response?.data?.message || '오류가 발생했습니다. 다시 시도해주세요.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이름 */}
        <div className="space-y-2">
          <Label htmlFor="name" className="korean-text">이름</Label>
          <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full"
          />
        </div>

        {/* 자기소개 */}
        <div className="space-y-2">
          <Label htmlFor="introduction" className="korean-text">자기소개</Label>
          <Textarea
              id="introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="강사 소개글을 입력하세요 (경력, 전문 분야, 교육 철학 등)"
              className="w-full min-h-[150px]"
          />
        </div>

        {/* 프로필 이미지 */}
        <div className="space-y-2">
          <Label htmlFor="profileImage" className="korean-text">프로필 이미지</Label>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleProfileChange}
                className="w-full"
            />
            {profilePreview && (
                <div className="w-24 h-24 overflow-hidden rounded-full border">
                  <img
                      src={profilePreview}
                      alt="프로필 미리보기"
                      className="w-full h-full object-cover"
                  />
                </div>
            )}
          </div>
        </div>

        {/* 카테고리 */}
        <div className="space-y-2">
          <Label htmlFor="category" className="korean-text">강의 카테고리</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 이력서 업로드 */}
        <div className="space-y-2">
          <Label htmlFor="resume" className="korean-text">이력서 업로드</Label>
          <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="w-full"
          />
          {resumeName && <p className="text-sm mt-2">선택된 파일: {resumeName}</p>}
        </div>

        {/* 제출 버튼 */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? '제출 중...' : '강사 지원서 제출하기'}
        </Button>
      </form>
  );
};

export default InstructorApplicationForm;
