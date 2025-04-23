import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Bot, Code, MessageSquare, ChevronRight, ChevronLeft, RefreshCw, History, FileCode } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset
} from '@/components/ui/sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AICodeEditor from '@/components/ai/AICodeEditor';
import AIChatPanel from '@/components/ai/AIChatPanel';
import AIHistorySidebar from '@/components/ai/AIHistorySidebar';
import { useAiCurriculum } from '@/hooks/useAiCurriculum';
import { aiAPI } from '@/api/ai';

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
    { role: 'system', content: '안녕하세요! AI 코드 분석 튜터입니다. 코드에 대해 어떤 질문이 있으신가요?' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState('history'); // 'history' or 'outline'
  const { curriculum, isAnalyzing, generateCurriculum } = useAiCurriculum();

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;
    
    const newMessage = { role: 'user', content: userInput };
    setChatMessages((prev) => [...prev, newMessage]);
    setUserInput('');
    setIsProcessing(true);
    
    try {
      // In a real application, we would send this to the AI API
      // For now, we'll simulate a response after a short delay
      setTimeout(() => {
        const aiResponse = { 
          role: 'assistant', 
          content: `이 코드는 ${activeSession.title}에 관한 패턴을 보여주고 있습니다. 주요 포인트는 다음과 같습니다:
          
1. 효율적인 상태 관리를 위한 메모이제이션 기법을 사용했습니다.
2. 컴포넌트 리렌더링을 최소화하는 패턴이 적용되었습니다.
3. 데이터 흐름이 단방향으로 설계되어 예측 가능성이 높습니다.

더 구체적인 질문이 있으시면 편하게 물어보세요!`
        };
        
        setChatMessages((prev) => [...prev, aiResponse]);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.' },
      ]);
      setIsProcessing(false);
    }
  };
  
  const selectSession = (session) => {
    setActiveSession(session);
    // Reset chat for new session or load related chats if implemented
    setChatMessages([
      { role: 'system', content: `${session.title}에 대한 분석을 시작합니다. 어떤 질문이 있으신가요?` },
    ]);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 lg:pt-24">  {/* Adjusted padding to prevent header overlap */}
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-[calc(100vh-5rem)] w-full">
            {/* History Sidebar */}
            <Sidebar collapsible="icon" variant="sidebar">
              <SidebarHeader className="h-14 flex items-center justify-between px-4">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 text-ghibli-forest mr-2" />
                  <span className="font-medium text-ghibli-forest">AI 코드 분석</span>
                </div>
                <SidebarTrigger />
              </SidebarHeader>
              
              <SidebarContent>
                <Tabs defaultValue="history" className="w-full" onValueChange={(value) => setSidebarView(value)}>
                  <div className="px-2">
                    <TabsList className="w-full">
                      <TabsTrigger value="history" className="flex-1">
                        <History className="h-4 w-4 mr-1" />
                        기록
                      </TabsTrigger>
                      <TabsTrigger value="outline" className="flex-1">
                        <FileCode className="h-4 w-4 mr-1" />
                        개요
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="history" className="mt-0">
                    <SidebarGroup>
                      <SidebarGroupLabel>최근 분석</SidebarGroupLabel>
                      <SidebarMenu>
                        {mockSessions.map((session) => (
                          <SidebarMenuItem key={session.id}>
                            <SidebarMenuButton 
                              onClick={() => selectSession(session)}
                              isActive={activeSession.id === session.id}
                              tooltip={session.summary}
                            >
                              <Code className="h-4 w-4" />
                              <span>{session.title}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroup>
                  </TabsContent>
                  
                  <TabsContent value="outline" className="mt-0">
                    <SidebarGroup>
                      <SidebarGroupLabel>코드 구조</SidebarGroupLabel>
                      <div className="px-2 py-1 text-sm text-ghibli-stone">
                        <div className="flex items-center pl-2 py-1">
                          <ChevronRight className="h-3 w-3 mr-1" />
                          <span>컴포넌트 정의</span>
                        </div>
                        <div className="flex items-center pl-6 py-1 text-ghibli-forest">
                          <span>ExpensiveComponent()</span>
                        </div>
                        <div className="flex items-center pl-2 py-1">
                          <ChevronRight className="h-3 w-3 mr-1" />
                          <span>주요 훅</span>
                        </div>
                        <div className="flex items-center pl-6 py-1 text-ghibli-forest">
                          <span>useMemo()</span>
                        </div>
                      </div>
                    </SidebarGroup>
                  </TabsContent>
                </Tabs>
              </SidebarContent>
            </Sidebar>
            
            {/* Main content area - with code editor and chat */}
            <SidebarInset>
              <div className="flex flex-col md:flex-row h-full">
                {/* Code Editor Panel */}
                <div className="w-full md:w-1/2 border-r border-border">
                  <div className="h-full flex flex-col">
                    <div className="border-b border-border p-2 flex justify-between items-center bg-ghibli-midnight/5">
                      <div className="flex items-center">
                        <FileCode className="h-4 w-4 mr-2 text-ghibli-forest" />
                        <span className="text-sm font-medium">{activeSession.title}</span>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-[#1E1E1E]">
                      <pre className="p-4 text-[#D4D4D4] font-mono text-sm whitespace-pre overflow-x-auto">
                        <code>{activeSession.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                
                {/* Chat Panel */}
                <div className="w-full md:w-1/2 flex flex-col h-full">
                  <div className="border-b border-border p-2 flex justify-between items-center bg-ghibli-midnight/5">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-ghibli-forest" />
                      <span className="text-sm font-medium">AI 챗봇</span>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 bg-white">
                    <div className="space-y-4">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.role === 'user'
                                ? 'bg-ghibli-forest text-white'
                                : msg.role === 'system'
                                ? 'bg-ghibli-cloud/70 text-ghibli-midnight'
                                : 'bg-ghibli-cloud text-ghibli-midnight'
                            }`}
                          >
                            <div className="whitespace-pre-line">{msg.content}</div>
                          </div>
                        </div>
                      ))}
                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-3 bg-ghibli-cloud text-ghibli-midnight">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 rounded-full bg-ghibli-forest animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-ghibli-forest animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-ghibli-forest animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 border-t border-border bg-white">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="질문을 입력하세요..."
                        className="flex-1 px-3 py-2 rounded-l-md border border-border focus:outline-none focus:border-ghibli-forest"
                        disabled={isProcessing}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!userInput.trim() || isProcessing}
                        className="rounded-l-none rounded-r-md bg-ghibli-forest hover:bg-ghibli-forest/90"
                      >
                        전송
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <AIHistorySidebar sessions={mockSessions} onSelectSession={selectSession} activeSessionId={activeSession.id} />
        </SheetContent>
      </Sheet>
      
      <Footer />
    </div>
  );
};

export default AILectures;
