import React, { useRef, useEffect, useState } from "react";
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
} from "@/components/ui/sidebar";
import { Bot, Code, History, FileCode, ChevronRight, Menu } from "lucide-react";

interface LectureSession {
    id: string;
    title: string;
    summary: string;
    timestamp: string;
    code: string;
}

interface LectureSidebarProps {
    activeSession: LectureSession;
    sidebarView: string;
    setSidebarView: (v: string) => void;
    selectSession: (session: LectureSession) => void;
}

const LectureSidebar: React.FC<LectureSidebarProps> = ({
    activeSession,
    sidebarView,
    setSidebarView,
    selectSession,
}) => {
    const [hasScrollableContent, setHasScrollableContent] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
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
    }, []);

    if (isCollapsed) {
        return (
            <div 
                className="fixed top-[92px] left-0 z-[50] w-12 h-12 flex items-center justify-center bg-white border border-l-0 rounded-r shadow-md"
            >
                <button 
                    onClick={() => setIsCollapsed(false)} 
                    className="focus:outline-none"
                >
                    <Menu className="h-6 w-6 text-ghibli-forest" />
                </button>
            </div>
        );
    }

    return (
        <Sidebar className="h-fit max-h-[calc(100vh-50px)] mt-[92px] w-64 border-r bg-white">
            <SidebarHeader className="h-14 flex items-center justify-between px-4">
                <div className="flex items-center">
                    <Bot className="h-5 w-5 text-ghibli-forest mr-2" />
                    <span className="font-medium text-ghibli-forest">AI 코드 분석</span>
                </div>
                <button onClick={() => setIsCollapsed(true)}>
                    <FileCode className="h-4 w-4" />
                </button>
            </SidebarHeader>

            <SidebarContent
                ref={sidebarContentRef}
                className="pt-2 px-2 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 200px)" }}
            >
                <Tabs value={sidebarView} className="w-full" onValueChange={setSidebarView}>
                    <TabsList className="w-full">
                        <TabsTrigger value="history" className="flex-1">
                            <History className="h-4 w-4 mr-1" /> 기록
                        </TabsTrigger>
                        <TabsTrigger value="outline" className="flex-1">
                            <FileCode className="h-4 w-4 mr-1" /> 개요
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="history" className="mt-0">
                        <SidebarGroup>
                            <SidebarGroupLabel>최근 분석</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => selectSession(activeSession)}
                                        isActive={true}
                                        tooltip={activeSession.summary}
                                    >
                                        <Code className="h-4 w-4" />
                                        <span>{activeSession.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                            {hasScrollableContent && (
                                <div className="py-2 text-center text-xs text-ghibli-stone animate-pulse">
                                    스크롤하여 더 보기...
                                </div>
                            )}
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
                            </div>
                        </SidebarGroup>
                    </TabsContent>
                </Tabs>
            </SidebarContent>
        </Sidebar>
    );
};

export default LectureSidebar;
