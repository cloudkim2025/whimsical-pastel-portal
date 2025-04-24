
import React, { useRef, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, History, FileCode, ChevronRight } from "lucide-react";

interface Session {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  code: string;
}

interface LectureSidebarProps {
  sessions: Session[];
  activeSession: Session;
  selectSession: (session: Session) => void;
  isCollapsed: boolean;
}

const LectureSidebar: React.FC<LectureSidebarProps> = ({
  sessions,
  activeSession,
  selectSession,
  isCollapsed,
}) => {
  const [hasScrollableContent, setHasScrollableContent] = useState(false);
  const sidebarContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScrollable = () => {
      if (sidebarContentRef.current) {
        const { scrollHeight, clientHeight } = sidebarContentRef.current;
        setHasScrollableContent(scrollHeight > clientHeight);
      }
    };
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [sessions]);

  return (
    <div className={`h-full bg-white border-r border-border transition-all duration-300 ease-in-out 
      ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-[260px] opacity-100'}`}>
      <div className="h-14 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-ghibli-forest" />
          <span className="font-medium text-ghibli-forest">AI 코드 분석</span>
        </div>
      </div>

      <div
        ref={sidebarContentRef}
        className="pt-2 px-2 overflow-y-auto"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="history" className="flex-1">
              <History className="h-4 w-4 mr-1" /> 기록
            </TabsTrigger>
            <TabsTrigger value="outline" className="flex-1">
              <FileCode className="h-4 w-4 mr-1" /> 개요
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-0">
            <div className="mt-2">
              <div className="text-xs font-medium text-ghibli-stone mb-2">최근 분석</div>
              <div className="space-y-1">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => selectSession(session)}
                    className={`w-full text-left flex items-center gap-2 overflow-hidden rounded-md p-2 text-sm hover:bg-sidebar-accent
                      ${session.id === activeSession.id ? 'bg-sidebar-accent font-medium' : ''}`}
                    title={session.summary}
                  >
                    <Code className="h-4 w-4" />
                    <span className="truncate">{session.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="outline" className="mt-0">
            <div className="mt-2">
              <div className="text-xs font-medium text-ghibli-stone mb-2">코드 구조</div>
              <div className="px-2 py-1 text-sm text-ghibli-stone">
                {activeSession.code && (
                  <div>
                    <div className="flex items-center pl-2 py-1">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      <span>{activeSession.title}</span>
                    </div>
                    <div className="pl-6 py-1">
                      <span className="text-ghibli-forest">{activeSession.summary}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LectureSidebar;
