
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import LectureSidebar from "@/components/ai/LectureSidebar";
import LectureCodePanel from "@/components/ai/LectureCodePanel";
import LectureChatPanel from "@/components/ai/LectureChatPanel";
import AIHistorySidebar from "@/components/ai/AIHistorySidebar";
import { useAiCurriculum } from "@/hooks/useAiCurriculum";

const mockSessions = [
  { 
    id: 'session1', 
    title: 'React 컴포넌트 최적화', 
    summary: '메모이제이션과 상태관리 분석',
    timestamp: '2025-04-22',
    code: `// React 컴포넌트 최적화 예제
import { useState, useCallback, useMemo } from 'react';

// 👉 메모이제이션을 활용한 최적화
function ExpensiveComponent({ data }) {
  // ✅ useMemo로 비용이 높은 계산 메모이제이션
  const processedData = useMemo(() => {
    console.log('무거운 계산 실행...');
    return data.map(item => item * 2).filter(item => item > 10);
  }, [data]); // data가 변경될 때만 재계산
  
  return (
    <div>
      <h2>처리된 데이터</h2>
      <ul>
        {processedData.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}`
  },
  { 
    id: 'session2', 
    title: 'API 요청 패턴 분석', 
    summary: 'axios와 에러 핸들링 패턴',
    timestamp: '2025-04-21',
    code: `// API 요청 패턴 예제
import axios from 'axios';

// 👉 API 요청 함수 추상화
export async function fetchData(endpoint, options = {}) {
  try {
    // ✅ 기본 설정과 사용자 옵션 병합
    const response = await axios({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${getAuthToken()}\`,
      },
      ...options,
      url: endpoint,
    });
    
    return response.data;
  } catch (error) {
    // ✅ 에러 타입에 따른 처리
    if (error.response) {
      // 서버 응답이 있는 에러 (4xx, 5xx)
      console.error('API 오류:', error.response.status, error.response.data);
      throw new Error(\`API Error: \${error.response.status}\`);
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 에러
      console.error('네트워크 오류:', error.request);
      throw new Error('Network Error');
    } else {
      // 요청 설정 중 발생한 에러
      console.error('요청 오류:', error.message);
      throw error;
    }
  }
}`
  },
  { 
    id: 'session3', 
    title: '상태관리 패턴 비교', 
    summary: 'Redux vs Context API 성능 비교',
    timestamp: '2025-04-20',
    code: `// Context API와 Redux 비교
import { createContext, useContext, useReducer } from 'react';

// 👉 Context API 예제
const CounterContext = createContext();

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// ✅ Context Provider 컴포넌트
export function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

// ✅ Custom Hook으로 컨텍스트 사용
export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
}`
  }
];

const AILectures = () => {
  const [activeSession, setActiveSession] = useState(mockSessions[0]);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "system" as const,
      content: "안녕하세요! AI 코드 분석 튜터입니다. 코드에 대해 어떤 질문이 있으신가요?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState("history");
  const { curriculum, isAnalyzing, generateCurriculum } = useAiCurriculum();

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;

    const newMessage = { role: "user" as const, content: userInput };
    setChatMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsProcessing(true);

    try {
      setTimeout(() => {
        const aiResponse = {
          role: "assistant" as const,
          content: `이 코드는 ${activeSession.title}에 관한 패턴을 보여주고 있습니다. 주요 포인트는 다음과 같습니다:

1. 효율적인 상태 관리를 위한 메모이제이션 기법을 사용했습니다.
2. 컴포넌트 리렌더링을 최소화하는 패턴이 적용되었습니다.
3. 데이터 흐름이 단방향으로 설계되어 예측 가능성이 높습니다.

더 구체적인 질문이 있으시면 편하게 물어보세요!`,
        };

        setChatMessages((prev) => [...prev, aiResponse]);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.",
        },
      ]);
      setIsProcessing(false);
    }
  };

  const selectSession = (session) => {
    setActiveSession(session);
    setChatMessages([
      {
        role: "system" as const,
        content: `${session.title}에 대한 분석을 시작합니다. 어떤 질문이 있으신가요?`,
      },
    ]);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-[72px] lg:pt-[92px] px-0"> {/* 헤더와 겹치지 않게 패딩 조정 */}
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-[calc(100vh-5.5rem)] w-full">
            <LectureSidebar
              sessions={mockSessions}
              activeSession={activeSession}
              sidebarView={sidebarView}
              setSidebarView={setSidebarView}
              selectSession={selectSession}
            />
            <SidebarInset>
              <div className="flex flex-col md:flex-row h-full">
                {/* Code Editor Panel */}
                <div className="w-full md:w-1/2 border-r border-border flex flex-col"
                  style={{ maxHeight: "70vh", minHeight: "420px", height: "70vh" }}>
                  <LectureCodePanel
                    title={activeSession.title}
                    code={activeSession.code}
                  />
                </div>
                {/* Chat Panel */}
                <div className="w-full md:w-1/2 flex flex-col h-full"
                  style={{ maxHeight: "70vh", minHeight: "420px", height: "70vh" }}>
                  <LectureChatPanel
                    messages={chatMessages}
                    userInput={userInput}
                    setUserInput={setUserInput}
                    isProcessing={isProcessing}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <AIHistorySidebar
            sessions={mockSessions}
            onSelectSession={selectSession}
            activeSessionId={activeSession.id}
          />
        </SheetContent>
      </Sheet>
      <Footer />
    </div>
  );
};

export default AILectures;

