
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Bot, Code, History, FileCode, ChevronRight, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LectureSession {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  code: string;
}

interface LectureSidebarProps {
  sessions: LectureSession[];
  activeSession: LectureSession;
  sidebarView: string;
  setSidebarView: (v: string) => void;
  selectSession: (session: LectureSession) => void;
}

const LectureSidebar: React.FC<LectureSidebarProps> = ({
  sessions,
  activeSession,
  sidebarView,
  setSidebarView,
  selectSession,
}) => {
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const sidebarContentRef = React.useRef<HTMLDivElement>(null);

  // Handle scroll for infinite loading
  const handleScroll = () => {
    if (!sidebarContentRef.current || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = sidebarContentRef.current;
    
    // If scrolled to bottom (with a small threshold)
    if (scrollHeight - scrollTop - clientHeight < 20) {
      // Load more sessions (simulating for now)
      console.log("Loading more sessions...");
      setPage(prev => prev + 1);
      
      // Here you would typically fetch more data
      // For now, let's just simulate the end of data after a few pages
      if (page >= 3) {
        setHasMore(false);
      }
    }
  };

  React.useEffect(() => {
    const contentElement = sidebarContentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, page]);

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="h-fit max-h-[calc(100vh-200px)] mt-[92px]" // Added top margin to match header height
    >
      <SidebarHeader className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center">
          <Bot className="h-5 w-5 text-ghibli-forest mr-2" />
          <span className="font-medium text-ghibli-forest">AI 코드 분석</span>
        </div>
        <SidebarTrigger>
          <MenuIcon className="h-4 w-4" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent 
        ref={sidebarContentRef} 
        className="pt-2 px-2 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        <Tabs value={sidebarView} className="w-full" onValueChange={setSidebarView}>
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

          <TabsContent value="history" className="mt-0">
            <SidebarGroup>
              <SidebarGroupLabel>최근 분석</SidebarGroupLabel>
              <SidebarMenu>
                {sessions.map((session) => (
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
                {hasMore && (
                  <div className="py-2 text-center text-xs text-ghibli-stone animate-pulse">
                    스크롤하여 더 보기...
                  </div>
                )}
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
  );
};

export default LectureSidebar;
