import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { aiAPI } from '@/api';

export const useAiCurriculum = () => {
  const [curriculum, setCurriculum] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const generateCurriculumOnly = async (videoFile: File) => {
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
      const formData = new FormData();
      formData.append('videoFile', videoFile);

      const { data } = await aiAPI.tryGenerateCurriculum(formData);

      const curriculumArray = data.curriculum
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

      setCurriculum(curriculumArray);

      toast({
        title: 'AI 분석 완료',
        description: '커리큘럼이 생성되었습니다.',
      });
    } catch (error) {
      console.error('AI 분석 오류:', error);
      toast({
        variant: 'destructive',
        title: '분석 실패',
        description: 'AI 분석 중 문제가 발생했습니다.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    // curriculum,
    isAnalyzing,
    generateCurriculumOnly,
  };
};
