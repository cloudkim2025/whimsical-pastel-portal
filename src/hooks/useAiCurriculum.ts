import { useState } from 'react';
import { aiAPI } from '@/api/ai';

export type CurriculumItem = {
  title: string;
  content: string;
};

export const useAiCurriculum = () => {
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateCurriculum = async (videoFile: File | null) => {
    if (!videoFile) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('videoFile', videoFile); // 백엔드에서 videoFile로 받음

      const response = await aiAPI.tryGenerateCurriculum(formData);

      const rawText: string = response.data.curriculum;

      // ✨ 문자열 커리큘럼을 줄 단위로 파싱
      const lines = rawText.split('\n').filter(line => line.trim() !== '');

      const parsed: CurriculumItem[] = lines.map((line) => {
        // "1. 제목 - 설명" 형식 기준 분리
        const match = line.match(/^\d+\.\s*(.+?)\s*[-–]\s*(.+)$/);
        if (match) {
          return {
            title: match[1].trim(),
            content: match[2].trim(),
          };
        }
        // fallback: 제목만 있는 경우
        return {
          title: line.trim(),
          content: '',
        };
      });

      setCurriculum(parsed);
    } catch (error) {
      console.error('❌ AI 커리큘럼 분석 실패:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    curriculum,
    isAnalyzing,
    generateCurriculum,
    setCurriculum
  };
};
