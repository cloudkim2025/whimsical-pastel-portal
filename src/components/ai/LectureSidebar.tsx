
import React, { useState, useRef, useEffect } from "react";
import { Bot, Clock, FileText } from "lucide-react";
import { ChatSessionMeta } from "@/types/userChatSession";
import { SessionMeta } from "@/types/session";
import { motion } from "framer-motion";

interface LectureSidebarProps {
    sessions: ChatSessionMeta[];
    latestSessions: SessionMeta[];
    activeSession: ChatSessionMeta | SessionMeta | null;
    selectSession: (session: ChatSessionMeta | SessionMeta) => void;
    sidebarView: "history" | "latest_docs";
    setSidebarView: (v: "history" | "latest_docs") => void;
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const LectureSidebar: React.FC<LectureSidebarProps> = ({
    sessions,
    latestSessions,
    activeSession,
    selectSession,
    sidebarView,
    setSidebarView,
    isCollapsed,
    toggleSidebar
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const check = () => {
            if (!ref.current) return;
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const renderList = (list: ChatSessionMeta[] | SessionMeta[], type: "history" | "latest_docs") =>
        list.map((s) => {
            const isActive =
                activeSession &&
                (type === "history"
                    ? "chat_session_id" in activeSession && "chat_session_id" in s && activeSession.chat_session_id === s.chat_session_id
                    : "session_id" in activeSession && "session_id" in s && activeSession.session_id === s.session_id);

            return (
                <li key={"chat_session_id" in s ? s.chat_session_id : s.session_id} className="mb-1">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectSession(s)}
                        className={`w-full text-left p-2 truncate rounded-lg flex items-center gap-2 transition-all duration-200 ${
                            isActive
                                ? "bg-ghibli-forest text-white shadow-md ring-2 ring-ghibli-sunset"
                                : "hover:bg-ghibli-meadow hover:shadow-sm"
                        }`}
                        title={s.summary}
                    >
                        {type === "history" ? (
                            <Clock className="h-4 w-4 text-ghibli-sky-blue" />
                        ) : (
                            <FileText className="h-4 w-4 text-ghibli-sky-blue" />
                        )}
                        <motion.span
                            key={"title" in s ? s.title : ""}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {s.title}
                        </motion.span>
                    </motion.button>
                </li>
            );
        });

    return (
        <div
            className={`h-full bg-gradient-to-b from-ghibli-cloud via-white to-ghibli-cloud border-r transition-all duration-300 ease-in-out ${
                isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-[260px] opacity-100"
            }`}
        >
            <div className="h-14 flex items-center px-4 justify-between border-b">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-ghibli-forest animate-float-slow" />
                    <span className="font-medium text-ghibli-forest">AI 코드 분석</span>
                </div>
            </div>
            <div className="flex">
                <button
                    className={`flex-1 py-2 text-center transition-colors duration-300 ${
                        sidebarView === "history"
                            ? "bg-ghibli-forest text-white"
                            : "hover:bg-ghibli-meadow"
                    }`}
                    onClick={() => setSidebarView("history")}
                >
                    기록
                </button>
                <button
                    className={`flex-1 py-2 text-center transition-colors duration-300 ${
                        sidebarView === "latest_docs"
                            ? "bg-ghibli-forest text-white"
                            : "hover:bg-ghibli-meadow"
                    }`}
                    onClick={() => setSidebarView("latest_docs")}
                >
                    최신문서
                </button>
            </div>
            <div
                ref={ref}
                className="pt-2 px-2 overflow-y-auto custom-scrollbar"
                style={{ height: "calc(100vh - 150px)" }}
            >
                <ul>
                    {sidebarView === "history" && renderList(sessions, "history")}
                    {sidebarView === "latest_docs" && renderList(latestSessions, "latest_docs")}
                </ul>
                {sessions.length === 0 && sidebarView === "history" && (
                    <p className="text-center text-sm text-gray-500 mt-4">저장된 기록이 없습니다.</p>
                )}
                {latestSessions.length === 0 && sidebarView === "latest_docs" && (
                    <p className="text-center text-sm text-gray-500 mt-4">최신문서가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default LectureSidebar;
