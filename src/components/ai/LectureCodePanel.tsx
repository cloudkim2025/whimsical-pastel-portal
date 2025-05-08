
import React, { useState, useRef, useEffect } from "react";
import { FileCode, RefreshCw, Clipboard, Check, Code2, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatSessionMeta } from "@/types/userChatSession";
import { SessionMeta } from "@/types/session";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface LectureCodePanelProps {
    session: ChatSessionMeta | SessionMeta | null;
    onRefresh?: () => void;
}

const LectureCodePanel: React.FC<LectureCodePanelProps> = ({ session, onRefresh }) => {
    const [copied, setCopied] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [tab, setTab] = useState<'summary' | 'code'>('summary');
    const { toast } = useToast();

    // 코드 클립보드에 복사하는 함수
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => {
                setCopied(true);
                toast({
                    title: "복사 완료",
                    description: "코드가 클립보드에 복사되었습니다.",
                    variant: "success",
                    duration: 2000,
                });
                setTimeout(() => setCopied(false), 2000);
            },
            (err) => {
                console.error('클립보드 복사 실패:', err);
                toast({
                    title: "복사 실패",
                    description: "코드를 클립보드에 복사하는데 실패했습니다.",
                    variant: "destructive",
                });
            }
        );
    };

    // session.code가 변경될 때만 코드 업데이트하도록 변경
    const codeToDisplay = session && "code" in session && session.code ? session.code : "(코드 없음)";
    const summaryToDisplay = session ? session.summary || "(요약 없음)" : "// 세션이 선택되지 않았습니다.";

    // Animation variants
    const tabVariants = {
        inactive: { opacity: 0.7, y: 5 },
        active: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 25 } }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-950">
            <div className="border-b border-gray-700 p-3 flex justify-between items-center bg-gray-800/30 backdrop-blur-sm">
                <div className="flex items-center">
                    <div className="bg-indigo-500/20 p-1.5 rounded-full mr-3">
                        <FileCode className="h-4 w-4 text-indigo-400" />
                    </div>
                    <motion.span 
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-sm font-medium text-gray-200 tracking-wide"
                    >
                        {session ? session.title : "세션 선택되지 않음"}
                    </motion.span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setFontSize((s) => Math.max(s - 2, 10))}
                        className="text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                        A-
                    </Button>
                    <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setFontSize((s) => Math.min(s + 2, 24))}
                        className="text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                        A+
                    </Button>
                    {onRefresh && session && "chat_session_id" in session && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-gray-700" 
                            onClick={onRefresh}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="border-b border-gray-700 flex">
                <motion.button
                    variants={tabVariants}
                    initial="inactive"
                    animate={tab === 'summary' ? 'active' : 'inactive'}
                    className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                        tab === 'summary' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setTab('summary')}
                >
                    <FileJson className="h-4 w-4" />
                    <span>요약</span>
                </motion.button>
                <motion.button
                    variants={tabVariants}
                    initial="inactive"
                    animate={tab === 'code' ? 'active' : 'inactive'}
                    className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                        tab === 'code' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setTab('code')}
                >
                    <Code2 className="h-4 w-4" />
                    <span>코드</span>
                </motion.button>
            </div>

            <div className="flex-1 overflow-auto p-5 space-y-4">
                {tab === 'summary' && (
                    <motion.div 
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-gray-800/50 p-4 rounded-lg shadow-inner border border-gray-700"
                    >
                        <div className="flex items-center mb-3">
                            <div className="bg-indigo-500/20 p-1 rounded-md mr-2">
                                <FileJson className="h-4 w-4 text-indigo-400" />
                            </div>
                            <span className="text-sm font-medium text-indigo-300 tracking-wide">AI 분석 요약</span>
                            <span className="ml-2 bg-indigo-600/30 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">
                                AI 생성됨
                            </span>
                        </div>
                        <div className="bg-gray-900/60 rounded-md p-4 shadow-inner border border-gray-800">
                            <pre className="text-gray-300 font-mono whitespace-pre-wrap overflow-auto" style={{ fontSize: `${fontSize}px` }}>
                                {summaryToDisplay}
                            </pre>
                        </div>
                    </motion.div>
                )}

                {tab === 'code' && (
                    <motion.div 
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-gray-800/50 p-4 rounded-lg shadow-inner border border-gray-700 relative"
                    >
                        <div className="flex items-center mb-3">
                            <div className="bg-indigo-500/20 p-1 rounded-md mr-2">
                                <Code2 className="h-4 w-4 text-indigo-400" />
                            </div>
                            <span className="text-sm font-medium text-indigo-300 tracking-wide">코드</span>
                        </div>
                        <button 
                            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 hover:bg-gray-700/50 rounded-full transition-colors" 
                            onClick={() => copyToClipboard(codeToDisplay)}
                            title="클립보드에 복사"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                        </button>
                        <div className="bg-gray-900/60 rounded-md p-4 shadow-inner border border-gray-800">
                            <pre className="text-gray-300 font-mono whitespace-pre-wrap overflow-auto" style={{ fontSize: `${fontSize}px` }}>
                                <code>{codeToDisplay}</code>
                            </pre>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default LectureCodePanel;
