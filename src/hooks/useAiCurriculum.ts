import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// ✅ FastAPI 여러 포트 중 연결 가능한 서버에 요청 시도하는 함수
const tryGenerateCurriculum = async (formData: FormData): Promise<Response> => {
  const urls = [
    'http://localhost:8001/api/ai/generate-curriculum',
    'http://localhost:8000/api/ai/generate-curriculum',
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'POST', body: formData });
      if (res.ok) return res;
    } catch (_) {
      // 실패 시 무시하고 다음 URL 시도
    }
  }

  throw new Error('FastAPI 서버에 연결할 수 없습니다.');
};

// ✅ AI 커리큘럼 분석 전용 커스텀 훅
export const useAiCurriculum = () => {
  const [curriculum, setCurriculum] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // ✅ 실제 값을 받아 커리큘럼 분석 + Spring Boot 전송
  const generateCurriculum = async (
      videoFile: File | null,
      title: string,
      description: string,
      category: string,
      instructorId: string,
      thumbnailFile?: File
  ) => {
    if (!videoFile) {
      toast({
        variant: 'destructive',
        title: '입력 오류',
        description: '비디오 파일을 선택해주세요.',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // 📦 FastAPI로 전송
      const formData = new FormData();
      formData.append('videoFile', videoFile);

      const response = await tryGenerateCurriculum(formData);
      if (!response.ok) {
        throw new Error('커리큘럼 생성 요청 실패');
      }

      const data = await response.json();

      const curriculumArray = data.curriculum
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

      setCurriculum(curriculumArray);

      // 📦 Spring Boot로 강의 등록 전송
      const springFormData = new FormData();
      springFormData.append('title', title);
      springFormData.append('description', description);
      springFormData.append('category', category);
      springFormData.append('instructorId', instructorId);
      springFormData.append('curriculum', JSON.stringify(
          curriculumArray.map((line, idx) => ({
            section: idx + 1,
            title: line,
          }))
      ));
      if (thumbnailFile) {
        springFormData.append('thumbnailFile', thumbnailFile);
      }
      springFormData.append('videoFile', videoFile);

      const springRes = await fetch('http://localhost:9004/api/lectures', {
        method: 'POST',
        body: springFormData,
      });

      if (!springRes.ok) {
        throw new Error('Spring 서버로 전송 실패');
      }

      toast({
        title: '커리큘럼 저장 완료',
        description: 'AI 분석 결과가 백엔드에 저장되었습니다.',
      });
    } catch (error) {
      console.error('커리큘럼 생성 오류:', error);
      toast({
        variant: 'destructive',
        title: '오류 발생',
        description: '커리큘럼 생성 또는 저장 중 문제가 발생했습니다.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    curriculum,
    isAnalyzing,
    generateCurriculum,
  };
};