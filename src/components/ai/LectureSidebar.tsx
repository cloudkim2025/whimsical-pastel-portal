
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
import { Bot, Code, History, FileCode, ChevronRight } from "lucide-react";

export interface LectureSession {
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
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center">
          <Bot className="h-5 w-5 text-ghibli-forest mr-2" />
          <span className="font-medium text-ghibli-forest">AI 코드 분석</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <Tabs value={sidebarView} className="w-full" onValueChange={setSidebarView}>
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
