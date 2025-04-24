import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import LectureSidebar from "@/components/ai/LectureSidebar";
import LectureCodePanel from "@/components/ai/LectureCodePanel";
import LectureChatPanel from "@/components/ai/LectureChatPanel";
import AIHistorySidebar from "@/components/ai/AIHistorySidebar";
import { useAiCurriculum } from "@/hooks/useAiCurriculum";
import { Menu, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const AILectures = () => {
  const [activeSession, setActiveSession] = useState({
    id: 'initial',
    title: '새로운 AI 코드 분석',
    summary: '코드를 입력하거나 분석할 내용을 선택해주세요.',
    timestamp: new Date().toISOString(),
    code: '// 코드를 입력하거나 분석할 세션을 선택해주세요.'
  });

  const mockSessions = [activeSession];
  const [chatMessages, setChatMessages] = useState<Message[]>([{
    role: "system",
    content: "안녕하세요! AI 코드 분석 튜터입니다. 코드에 대해 어떤 질문이 있으신가요?",
  }]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState("history");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { curriculum, isAnalyzing, generateCurriculum } = useAiCurriculum();

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;

    const newMessage: Message = { role: "user", content: userInput };
    setChatMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsProcessing(true);

    try {
      setTimeout(() => {
        const aiResponse: Message = {
          role: "assistant",
          content: `이 코드는 ${activeSession.title}에 관한 패턴을 보여주고 있습니다. 주요 포인트는 다음과 같습니다:\n\n1. 효율적인 상태 관리를 위한 메모이제이션 기법을 사용했습니다.\n2. 컴포넌트 리렌더링을 최소화하는 패턴이 적용되었습니다.\n3. 데이터 흐름이 단방향으로 설계되어 예측 가능성이 높습니다.\n\n더 구체적인 질문이 있으시면 편하게 물어보세요!`,
        };
        setChatMessages((prev) => [...prev, aiResponse]);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      setChatMessages((prev) => [...prev, {
        role: "assistant",
        content: "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.",
      }]);
      setIsProcessing(false);
    }
  };

  const selectSession = (session) => {
    setActiveSession(session);
    setChatMessages([{
      role: "system",
      content: `${session.title}에 대한 분석을 시작합니다. 어떤 질문이 있으신가요?`,
    }]);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-[72px] lg:pt-[92px] px-0">
        <div className="flex min-h-[calc(100vh-5.5rem)] w-full relative">
          <Button
            variant="ghost"
            size="icon"
            className={`fixed top-[92px] transition-all duration-300 z-50 bg-white border border-border shadow-md rounded-r-lg h-10 w-10 
              ${sidebarOpen ? 'left-[260px]' : 'left-2'}`}
            onClick={toggleSidebar}
          >
            <Book className={`h-5 w-5 text-ghibli-forest transition-transform duration-200 
              ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
          </Button>

          <LectureSidebar
            activeSession={activeSession}
            sidebarView={sidebarView}
            setSidebarView={setSidebarView}
            selectSession={selectSession}
            isCollapsed={!sidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <div className={`flex-1 flex flex-col md:flex-row h-full max-w-screen-xl mx-auto`}>
            <div
              className="w-full md:w-1/2 border-r border-border flex flex-col bg-black"
              style={{ height: "calc(100vh - 130px)", minHeight: "520px", maxHeight: "calc(100vh - 80px)", maxWidth: "840px" }}
            >
              <LectureCodePanel
                title={activeSession.title}
                code={activeSession.code}
                onRefresh={() => console.log("Refreshing code view")}
              />
            </div>
            <div
              className="w-full md:w-1/2 flex flex-col"
              style={{ height: "calc(100vh - 130px)", minHeight: "520px", maxHeight: "calc(100vh - 80px)" }}
            >
              <LectureChatPanel
                messages={chatMessages}
                userInput={userInput}
                setUserInput={setUserInput}
                isProcessing={isProcessing}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <AIHistorySidebar
            sessions={mockSessions}
            activeSessionId={activeSession.id}
            onSelectSession={selectSession}
          />
        </SheetContent>
      </Sheet>
      <Footer />
    </div>
  );
};

export default AILectures;
