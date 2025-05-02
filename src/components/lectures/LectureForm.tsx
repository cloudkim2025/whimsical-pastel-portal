// components/forms/LectureForm.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/data/lectureCategories';
import CurriculumPreview from '@/components/lectures/CurriculumPreview';
import { useAiCurriculum } from '@/hooks/useAiCurriculum';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { lectureAPI } from '@/api';

const LectureForm: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [curriculum, setCurriculum] = useState<string[]>([]); // 테스트 데이터 테스터후 삭제

  const { isAnalyzing, generateCurriculumOnly } = useAiCurriculum(); //테스트 후 curriculum 추가
// 테스트용 테스트후 아래내용 삭제
  React.useEffect(() => {
    // 🔽 테스트용 텍스트 커리큘럼 (AI 서버 응답처럼 구성)
    setCurriculum([
      '1. 인트로 및 개발환경 소개 - VSCode 설치, Node.js 설정 등 기본 환경 세팅 방법을 다룹니다.',
      '2. HTML/CSS 기초 - 시맨틱 태그, Flexbox, 레이아웃을 중심으로 설명합니다.',
      '3. JavaScript 문법과 예제 - 변수, 함수, 조건문 등 핵심 문법을 다룹니다.',
      '4. React 기본 개념 - 컴포넌트, props, 상태 관리 기초를 학습합니다.',
      '5. 상태 관리와 훅 - useState, useEffect 중심으로 실제 예제를 통해 다룹니다.',
      '6. API 연동 및 실전 예제 - fetch/axios를 사용해 외부 데이터 연동을 실습합니다.'
    ]);
  }, []);
//여기까지 테스트용 데이터
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name || !description || !category || !thumbnailImage || !videoFile || curriculum.length === 0) {
      toast({
        variant: 'destructive',
        title: '입력 오류',
        description: '모든 항목과 AI 커리큘럼 분석을 완료해주세요.'
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('curriculum', JSON.stringify(
          curriculum.map((line, idx) => ({
            section: idx + 1,
            title: line,
          }))
      ));
      formData.append('thumbnailFile', thumbnailImage);
      formData.append('videoFile', videoFile);

      console.log('✅ FormData 내용:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - name=${value.name}, type=${value.type}, size=${value.size}B`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      await lectureAPI.createLecture(formData);

      toast({
        title: '강의 등록 완료',
        description: '강의가 성공적으로 저장되었습니다.'
      });

      setName('');
      setDescription('');
      setThumbnailImage(null);
      setThumbnailPreview(null);
      setCategory('');
      setVideoFile(null);
      setVideoName('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '강의 업로드 중 오류가 발생했습니다.';
      setError(errorMessage);

      toast({
        variant: 'destructive',
        title: '업로드 실패',
        description: errorMessage
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">강의 제목</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="강의 제목" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">강의 설명</Label>
          <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="강의 설명"
              className="min-h-[150px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="thumbnail">썸네일</Label>
            <Input id="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} />
            {thumbnailPreview && (
                <img src={thumbnailPreview} alt="썸네일 미리보기" className="w-full rounded-md border aspect-video object-cover" />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoFile">강의 영상</Label>
            <Input id="videoFile" type="file" accept="video/*" onChange={handleVideoChange} />
            {videoName && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="text-sm truncate">{videoName}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    if (videoFile) generateCurriculumOnly(videoFile);
                  }} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 분석중...
                        </>
                    ) : (
                        <>AI 분석</>
                    )}
                  </Button>
                </div>
            )}
          </div>
        </div>

        {curriculum.length > 0 && <CurriculumPreview curriculum={curriculum} />}

        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isUploading}>
          {isUploading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" /> 업로드 중...
              </>
          ) : (
              <>
                <UploadCloud className="h-5 w-5" /> 강의 등록하기
              </>
          )}
        </Button>
      </form>
  );
};

export default LectureForm;
