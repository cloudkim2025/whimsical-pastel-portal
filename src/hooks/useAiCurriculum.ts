
import { useState } from 'react';

interface Curriculum {
  id: string;
  title: string;
  content: string[];
}

export interface AnalysisSession {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  code: string;
  analyses: {
    id: string;
    question: string;
    answer: string;
    timestamp: string;
  }[];
}

export const useAiCurriculum = () => {
  const [curriculum, setCurriculum] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessions, setSessions] = useState<AnalysisSession[]>([]);
  const [currentSession, setCurrentSession] = useState<AnalysisSession | null>(null);

  // 비디오 파일을 분석하여 커리큘럼을 생성하는 함수
  const generateCurriculum = (videoFile: File | null) => {
    if (!videoFile) {
      return;
    }

    setIsAnalyzing(true);
    
    // 실제로는 AI 서비스에 비디오를 업로드하고 분석 결과를 받아와야 함
    // 여기서는 시뮬레이션을 위한 더미 데이터를 생성
    setTimeout(() => {
      const dummyCurriculum = [
        "강의 소개 및 개발 환경 설정",
        "웹 개발의 기본 원리와 HTML/CSS 기초",
        "JavaScript 기초 문법과 DOM 조작",
        "반응형 웹 디자인과 모바일 최적화",
        "React의 개념과 컴포넌트 기반 아키텍처",
        "상태 관리와 React Hooks 활용법",
        "API 연동과 비동기 처리 방법",
        "Firebase를 이용한 백엔드 구축",
        "실전 프로젝트 개발 및 배포 방법",
        "웹 성능 최적화 및 SEO 기법"
      ];
      
      setCurriculum(dummyCurriculum);
      setIsAnalyzing(false);
    }, 2000);
  };

  // 코드를 분석하여 새 세션을 생성하는 함수
  const analyzeCode = (code: string, title: string) => {
    setIsAnalyzing(true);
    
    // 실제로는 AI 서비스에 코드를 전송하고 분석 결과를 받아와야 함
    // 여기서는 시뮬레이션을 위한 더미 데이터를 생성
    setTimeout(() => {
      const newSession: AnalysisSession = {
        id: `session-${Date.now()}`,
        title,
        summary: '코드 구조 및 패턴 분석',
        timestamp: new Date().toISOString(),
        code,
        analyses: []
      };
      
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      setIsAnalyzing(false);
    }, 1500);
  };

  // 세션에 새 질문과 분석을 추가하는 함수
  const addAnalysisToSession = (sessionId: string, question: string, answer: string) => {
    setSessions(prev => {
      return prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            analyses: [
              ...session.analyses,
              {
                id: `analysis-${Date.now()}`,
                question,
                answer,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return session;
      });
    });
    
    // 현재 세션 업데이트
    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          analyses: [
            ...prev.analyses,
            {
              id: `analysis-${Date.now()}`,
              question,
              answer,
              timestamp: new Date().toISOString()
            }
          ]
        };
      });
    }
  };

  return {
    curriculum,
    isAnalyzing,
    generateCurriculum,
    sessions,
    currentSession,
    analyzeCode,
    addAnalysisToSession,
    setCurrentSession
  };
};
