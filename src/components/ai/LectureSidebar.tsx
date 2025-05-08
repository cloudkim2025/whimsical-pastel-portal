
import React, { useState, useRef, useEffect } from "react";
import { Bot, Clock, FileText, Search, X } from "lucide-react";
import { ChatSessionMeta } from "@/types/userChatSession";
import { SessionMeta } from "@/types/session";
import { motion, AnimatePresence } from "framer-motion";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSessions, setFilteredSessions] = useState<ChatSessionMeta[] | SessionMeta[]>([]);

    useEffect(() => {
        const check = () => {
            if (!ref.current) return;
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        const activeList = sidebarView === "history" ? sessions : latestSessions;
        if (!searchQuery.trim()) {
            setFilteredSessions(activeList);
            return;
        }

        const filtered = activeList.filter((s) => 
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.summary && s.summary.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredSessions(filtered);
    }, [searchQuery, sidebarView, sessions, latestSessions]);

    const renderList = (list: (ChatSessionMeta | SessionMeta)[], type: "history" | "latest_docs") =>
        list.map((s, index) => {
            const isActive =
                activeSession &&
                (type === "history"
                    ? "chat_session_id" in activeSession && activeSession.chat_session_id === (s as ChatSessionMeta).chat_session_id
                    : "session_id" in activeSession && activeSession.session_id === (s as SessionMeta).session_id);

            return (
                <motion.li 
                    key={"chat_session_id" in s ? s.chat_session_id : s.session_id} 
                    className="mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectSession(s)}
                        className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all duration-200 ${
                            isActive
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "hover:bg-indigo-100 text-slate-700"
                        }`}
                        title={s.summary}
                    >
                        <div className={`p-1.5 rounded-md mt-0.5 flex-shrink-0 ${isActive ? 'bg-indigo-500' : 'bg-indigo-100'}`}>
                            {type === "history" ? (
                                <Clock className={`h-4 w-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                            ) : (
                                <FileText className={`h-4 w-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                            )}
                        </div>
                        <div>
                            <div className="font-medium line-clamp-1">{s.title}</div>
                            {s.summary && (
                                <div className={`text-xs mt-1 line-clamp-2 ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                                    {s.summary.substring(0, 100)}
                                    {s.summary.length > 100 && "..."}
                                </div>
                            )}
                        </div>
                    </motion.button>
                </motion.li>
            );
        });

    const sidebarVariants = {
        open: { width: "280px", opacity: 1, transition: { duration: 0.3 } },
        closed: { 
            width: "0px", 
            opacity: 0, 
            transition: { 
                duration: 0.3,
                opacity: { duration: 0.2 }
            } 
        }
    };

    return (
        <motion.div
            variants={sidebarVariants}
            initial={false}
            animate={isCollapsed ? "closed" : "open"}
            className="h-full bg-white border-r overflow-hidden shadow-lg"
        >
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col"
                    >
                        <div className="h-16 flex items-center px-4 justify-between border-b">
                            <div className="flex items-center gap-2">
                                <div className="bg-indigo-100 p-1.5 rounded-full">
                                    <Bot className="h-5 w-5 text-indigo-600" />
                                </div>
                                <span className="font-medium text-slate-800">AI 코드 분석</span>
                            </div>
                            <button 
                                onClick={toggleSidebar}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-4 w-4 text-slate-500" />
                            </button>
                        </div>

                        <div className="px-4 py-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200"
                                    >
                                        <X className="h-3 w-3 text-slate-500" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex bg-gray-100">
                            <motion.button
                                whileHover={{ backgroundColor: sidebarView === "history" ? "#4f46e5" : "#e0e7ff" }}
                                className={`flex-1 py-2 text-center transition-colors duration-200 ${
                                    sidebarView === "history"
                                        ? "bg-indigo-600 text-white"
                                        : "text-slate-700 hover:bg-indigo-100"
                                }`}
                                onClick={() => setSidebarView("history")}
                            >
                                기록
                            </motion.button>
                            <motion.button
                                whileHover={{ backgroundColor: sidebarView === "latest_docs" ? "#4f46e5" : "#e0e7ff" }}
                                className={`flex-1 py-2 text-center transition-colors duration-200 ${
                                    sidebarView === "latest_docs"
                                        ? "bg-indigo-600 text-white"
                                        : "text-slate-700 hover:bg-indigo-100"
                                }`}
                                onClick={() => setSidebarView("latest_docs")}
                            >
                                최신문서
                            </motion.button>
                        </div>

                        <div
                            ref={ref}
                            className="flex-1 pt-3 px-4 overflow-y-auto custom-scrollbar"
                        >
                            {filteredSessions.length > 0 ? (
                                <ul>
                                    {renderList(
                                        filteredSessions as any, 
                                        sidebarView
                                    )}
                                </ul>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center text-center h-40 mt-8"
                                >
                                    <FileText className="h-10 w-10 text-gray-300 mb-3" />
                                    {searchQuery ? (
                                        <p className="text-sm text-gray-500">
                                            검색 결과가 없습니다.
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            {sidebarView === "history" ? "저장된 기록이 없습니다." : "최신문서가 없습니다."}
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LectureSidebar;
