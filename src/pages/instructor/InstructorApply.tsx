import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { verificationAPI } from '@/api/verification';
import { useNavigate } from 'react-router-dom';

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
  { id: 'other', name: '기타' }
];

const InstructorApply: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB 제한
        toast({
          variant: "destructive",
          title: "파일 크기 제한",
          description: "이력서 파일은 10MB 이하여야 합니다."
        });
        return;
      }
      setResume(file);
      setResumeName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!name || !introduction || !category || !profileImage || !resume) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "모든 항목을 입력해주세요."
      });
      return;
    }

    setIsSubmitting(true); // 제출 시작 표시

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', introduction);
      formData.append('category', category);
      formData.append('profileImage', profileImage);
      formData.append('resume', resume);

      const response = await verificationAPI.applyForTeacher(formData);

      const {success, message} = response.data;

      if (success) {
        toast({
          title: "지원서 제출 완료",
          description: "강사 지원서가 성공적으로 제출되었습니다. 심사 후 결과를 알려드리겠습니다."
        });

        // 폼 초기화
        setName('');
        setIntroduction('');
        setProfileImage(null);
        setProfilePreview(null);
        setCategory('');
        setResume(null);
        setResumeName('');

        navigate('/');
      } else {
        toast({
          title: "지원서 제출 실패",
          description: message || "서버에서 실패 응답을 받았습니다."
        });
      }

    } catch (error: any) {
      console.error("지원서 제출 중 오류:", error);
      toast({
        variant: "destructive",
        title: "제출 실패",
        description: error.response?.data?.message || "오류가 발생했습니다. 다시 시도해주세요."
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-6" lang="ko">강사 지원서</h1>
            <p className="text-ghibli-stone mb-8 korean-text">함께 성장할 수 있는 교육 플랫폼에 강사로 참여해보세요. 심사 후 승인이 완료되면 강의를 업로드하실 수 있습니다.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
              
              <div className="space-y-2">
                <Label htmlFor="profileImage" className="korean-text">프로필 이미지</Label>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileChange}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1 korean-text">
                      프로필로 사용할 이미지를 업로드해주세요. (JPG, PNG 형식)
                    </p>
                  </div>
                  {profilePreview && (
                    <div className="w-24 h-24 overflow-hidden rounded-full border border-border">
                      <img 
                        src={profilePreview} 
                        alt="프로필 미리보기" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="korean-text">강의 카테고리</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="korean-text">{cat.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1 korean-text">
                  전문적으로 강의하실 주요 분야를 선택해주세요.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resume" className="korean-text">이력서 업로드</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="w-full"
                />
                {resumeName && (
                  <p className="text-sm text-ghibli-forest mt-2">
                    <span className="korean-text">선택된 파일:</span> {resumeName}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1 korean-text">
                  PDF 또는 워드 문서 형식으로 이력서를 업로드해주세요. (최대 10MB)
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? <span className="korean-text">제출 중...</span> : <span className="korean-text">강사 지원서 제출하기</span>}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstructorApply;