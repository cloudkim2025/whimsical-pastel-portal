
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import LectureSidebar from "@/components/ai/LectureSidebar";
import LectureCodePanel from "@/components/ai/LectureCodePanel";
import LectureChatPanel from "@/components/ai/LectureChatPanel";
import AIBootUpAnimation from "@/components/ai/AIBootUpAnimation";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import API from "@/utils/apiClient";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface Session {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  code: string;
}

const AILectures = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session>({
    id: 'initial',
    title: '새로운 AI 코드 분석',
    summary: '코드를 입력하거나 분석할 내용을 선택해주세요.',
    timestamp: new Date().toISOString(),
    code: '// 코드를 입력하거나 분석할 세션을 선택해주세요.'
  });
  const [chatMessages, setChatMessages] = useState<Message[]>([{
    role: "system",
    content: "안녕하세요! AI 코드 분석 튜터입니다. 코드에 대해 어떤 질문이 있으신가요?",
  }]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchSessions();
    const timer = setTimeout(() => setShowContent(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await API.get('/aichat/history');
      setSessions([activeSession, ...response.data]);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    const newMessage: Message = { role: "user", content: message };
    setChatMessages(prev => [...prev, newMessage]);

    try {
      const response = await API.post('/aichat', {
        sessionId: activeSession.id,
        message,
        code: activeSession.code
      });

      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: response.data.message
      }]);

      if (response.data.code) {
        setActiveSession(prev => ({
          ...prev,
          code: response.data.code
        }));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.",
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectSession = async (session: Session) => {
    setActiveSession(session);
    setChatMessages([{
      role: "system",
      content: `${session.title}에 대한 분석을 시작합니다. 어떤 질문이 있으신가요?`,
    }]);

    try {
      const response = await API.get(`/aichat/analyze/${session.id}`);
      if (response.data.messages) {
        setChatMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Failed to load session messages:', error);
    }
  };

  const handleBootUpComplete = () => {
    setIsLoading(false);
  };

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <>
      {isLoading && <AIBootUpAnimation onComplete={handleBootUpComplete} />}
      
      <motion.div 
        className="h-screen overflow-hidden flex flex-col bg-background"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Header />
        <div className="pt-[72px] lg:pt-[92px] px-0 flex-1 overflow-hidden">
          <div className="flex h-full w-full relative">
            <Button
              variant="ghost"
              size="icon"
              className={`fixed top-[100px] transition-all duration-300 z-50 bg-white border border-border shadow-md rounded-r-lg h-10 w-10 
                ${sidebarOpen ? 'left-[260px]' : 'left-2'}`}
              onClick={toggleSidebar}
            >
              <Book className={`h-5 w-5 text-ghibli-forest transition-transform duration-200 
                ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
            </Button>

            <LectureSidebar
              sessions={sessions}
              activeSession={activeSession}
              selectSession={selectSession}
              isCollapsed={!sidebarOpen}
            />

            <div className="flex-1 flex flex-col md:flex-row h-full max-w-screen-xl mx-auto">
              <div className="w-full md:w-1/2 border-r border-border flex flex-col bg-black">
                <LectureCodePanel
                  title={activeSession.title}
                  code={activeSession.code}
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col">
                <LectureChatPanel
                  messages={chatMessages}
                  isProcessing={isProcessing}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AILectures;
