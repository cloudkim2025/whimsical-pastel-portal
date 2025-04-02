import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, UploadCloud, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { lectureAPI } from '@/api/lecture';

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

const LectureUpload: React.FC = () => {
  const { toast } = useToast();
  const { user, isInstructor } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedCurriculum, setGeneratedCurriculum] = useState<string[]>([]);

  useEffect(() => {
    if (!isInstructor) {
      toast({
        variant: "destructive",
        title: "접근 권한 없음",
        description: "강사 계정만 강의를 등록할 수 있습니다."
      });
      navigate('/');
    }
  }, [isInstructor, navigate, toast]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailImage(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoName(file.name);
    }
  };

  const analyzeVideo = () => {
    if (!videoFile) {
      toast({
        variant: "destructive",
        title: "영상 파일 필요",
        description: "AI 분석을 위해 강의 영상을 업로드해주세요."
      });
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const fakeCurriculum = [
        "1. 강의 소개 및 환경 설정 (0:00 - 5:30)",
        "2. 프로젝트 구조 설명 (5:31 - 12:45)",
        "3. 핵심 개념 설명 (12:46 - 25:10)",
        "4. 실습 예제 1 (25:11 - 40:00)",
        "5. 실습 예제 2 (40:01 - 55:30)",
        "6. 문제 해결 및 디버깅 방법 (55:31 - 1:10:15)",
        "7. 실전 응용 및 마무리 (1:10:16 - 끝)"
      ];
      
      setGeneratedCurriculum(fakeCurriculum);
      setIsAnalyzing(false);
      
      toast({
        title: "AI 분석 완료",
        description: "강의 커리큘럼이 성공적으로 생성되었습니다."
      });
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !category || !thumbnailImage || !videoFile) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "모든 항목을 입력해주세요."
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const lectureData = {
        name,
        description,
        category,
        curriculum: generatedCurriculum,
        instructorId: user?.id
      };
      
      await lectureAPI.createLecture(lectureData);
      
      toast({
        title: "강의 업로드 완료",
        description: "강의가 성공적으로 업로드되었습니다. 검토 후 게시됩니다."
      });
      
      setName('');
      setDescription('');
      setThumbnailImage(null);
      setThumbnailPreview(null);
      setCategory('');
      setVideoFile(null);
      setVideoName('');
      setGeneratedCurriculum([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "업로드 실패",
        description: "오류가 발생했습니다. 다시 시도해주세요."
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isInstructor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>접근 권한 없음</AlertTitle>
              <AlertDescription>
                강의 등록은 강사 계정만 이용할 수 있습니다.
                <div className="mt-4">
                  <Button onClick={() => navigate('/')} variant="outline">
                    홈으로 돌아가기
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-6" lang="ko">강의 등록</h1>
            <p className="text-ghibli-stone mb-8 korean-text">
              {user?.nickname} 강사님, 새로운 강의를 등록해주세요.
              강의를 업로드하면 AI가 자동으로 영상을 분석하여 커리큘럼을 생성합니다. 
              업로드된 강의는 검토 후 승인되면 플랫폼에 공개됩니다.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="korean-text">강의 제목</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="강의 제목을 입력하세요"
                    className="w-full"
                  />
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
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="korean-text">강의 설명</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="강의에 대한 상세 설명을 입력하세요"
                  className="w-full min-h-[150px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail" className="korean-text">강의 썸네일</Label>
                  <div className="flex flex-col gap-4">
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="w-full"
                    />
                    {thumbnailPreview && (
                      <div className="w-full aspect-video overflow-hidden rounded-md border border-border">
                        <img 
                          src={thumbnailPreview} 
                          alt="썸네일 미리보기" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="videoFile" className="korean-text">강의 영상</Label>
                  <div className="space-y-4">
                    <Input
                      id="videoFile"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="w-full"
                    />
                    {videoName && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <span className="text-sm truncate">{videoName}</span>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={analyzeVideo}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span className="korean-text">분석중...</span>
                            </>
                          ) : (
                            <span className="korean-text">AI 분석</span>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {generatedCurriculum.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4 korean-text">AI 생성 커리큘럼</h3>
                    <ul className="space-y-2 korean-text">
                      {generatedCurriculum.map((item, index) => (
                        <li key={index} className="p-2 bg-muted/50 rounded-md">{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span className="korean-text">업로드 중...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-5 w-5" />
                      <span className="korean-text">강의 등록하기</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LectureUpload;
