
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAiCurriculum = () => {
  const [curriculum, setCurriculum] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const generateCurriculum = (videoFile: File | null) => {
    if (!videoFile) {
      toast({
        variant: "destructive",
        title: "영상 파일 필요",
        description: "AI 분석을 위해 강의 영상을 업로드해주세요."
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulating AI analysis with a timeout
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
      
      setCurriculum(fakeCurriculum);
      setIsAnalyzing(false);
      
      toast({
        title: "AI 분석 완료",
        description: "강의 커리큘럼이 성공적으로 생성되었습니다."
      });
    }, 3000);
  };

  return {
    curriculum,
    isAnalyzing,
    generateCurriculum
  };
};
