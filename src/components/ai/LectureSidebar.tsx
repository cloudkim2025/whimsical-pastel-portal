
import React, { useRef, useEffect, useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Bot, Code, History, FileCode, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const LectureSidebar: React.FC<LectureSidebarProps> = ({
    activeSession,
    sidebarView,
    setSidebarView,
    selectSession,
    isCollapsed,
    toggleSidebar,
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
    }, []);

    if (isCollapsed) {
        return null;
    }

    return (
        <div className="h-full bg-white border-r border-border">
            <div className="h-14 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-ghibli-forest" />
                    <span className="font-medium text-ghibli-forest">AI 코드 분석</span>
                    <Button 
                        variant="ghost"
                        size="sm"
                        className="p-1 h-8 w-8 hover:bg-purple-50 transition-colors"
                        onClick={toggleSidebar}
                    >
                        <Book 
                            className={`h-5 w-5 text-ghibli-forest transition-transform duration-200 ${!isCollapsed ? "rotate-45" : ""}`}
                            strokeWidth={2.5}
                        />
                    </Button>
                </div>
            </div>

            <div
                ref={sidebarContentRef}
                className="pt-2 px-2 overflow-y-auto"
                style={{ height: "calc(100vh - 150px)" }}
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
                        <div className="mt-2">
                            <div className="text-xs font-medium text-ghibli-stone mb-2">최근 분석</div>
                            <div>
                                <button
                                    onClick={() => selectSession(activeSession)}
                                    className="w-full text-left flex items-center gap-2 overflow-hidden rounded-md p-2 text-sm hover:bg-sidebar-accent bg-sidebar-accent font-medium"
                                    title={activeSession.summary}
                                >
                                    <Code className="h-4 w-4" />
                                    <span className="truncate">{activeSession.title}</span>
                                </button>
                            </div>
                            {hasScrollableContent && (
                                <div className="py-2 text-center text-xs text-ghibli-stone animate-pulse">
                                    스크롤하여 더 보기...
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="outline" className="mt-0">
                        <div className="mt-2">
                            <div className="text-xs font-medium text-ghibli-stone mb-2">코드 구조</div>
                            <div className="px-2 py-1 text-sm text-ghibli-stone">
                                <div className="flex items-center pl-2 py-1">
                                    <ChevronRight className="h-3 w-3 mr-1" />
                                    <span>컴포넌트 정의</span>
                                </div>
                                <div className="flex items-center pl-6 py-1 text-ghibli-forest">
                                    <span>ExpensiveComponent()</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default LectureSidebar;
