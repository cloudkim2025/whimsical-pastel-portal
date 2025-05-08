
import React, { useState, useRef, useEffect } from "react";
import { FileCode, RefreshCw, Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatSessionMeta } from "@/types/userChatSession";
import { SessionMeta } from "@/types/session";

interface LectureCodePanelProps {
    session: ChatSessionMeta | SessionMeta | null;
    onRefresh?: () => void;
}

const LectureCodePanel: React.FC<LectureCodePanelProps> = ({ session, onRefresh }) => {
    const [copied, setCopied] = useState(false);
    const [fontSize, setFontSize] = useState(14);

    // 코드 클립보드에 복사하는 함수
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            },
            (err) => {
                console.error('클립보드 복사 실패:', err);
            }
        );
    };

    // session.code가 변경될 때만 코드 업데이트하도록 변경
    const codeToDisplay = session && "code" in session && session.code ? session.code : "(코드 없음)";

    return (
        <div className="h-full flex flex-col">
            <div className="border-b border-border p-2 flex justify-between items-center bg-ghibli-midnight/5">
                <div className="flex items-center">
                    <FileCode className="h-4 w-4 mr-2 text-ghibli-forest" />
                    <span className="text-sm font-medium">
                        {session ? session.title : "세션 선택되지 않음"}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button size="sm" onClick={() => setFontSize((s) => Math.max(s - 2, 10))}>A-</Button>
                    <Button size="sm" onClick={() => setFontSize((s) => Math.min(s + 2, 24))}>A+</Button>
                    {onRefresh && session && "chat_session_id" in session && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onRefresh}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#1E1E1E] p-4 space-y-4">
                <div className="space-y-4">
                    <div className="bg-gray-800 p-3 rounded relative">
                        <span className="block text-[#9CDCFE] font-semibold mb-2">
                            [요약] <span className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">AI 생성됨</span>
                        </span>
                        <code className="text-[#D4D4D4] font-mono whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>
                            {session ? session.summary || "(요약 없음)" : "// 세션이 선택되지 않았습니다."}
                        </code>
                    </div>

                    <div className="bg-gray-900 p-3 rounded relative">
                        <span className="block text-[#9CDCFE] font-semibold mb-2">[코드]</span>
                        <button 
                            className="absolute top-3 right-3 text-gray-400 hover:text-white" 
                            onClick={() => copyToClipboard(codeToDisplay)}
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                        </button>
                        <pre className="text-[#D4D4D4] font-mono whitespace-pre-wrap overflow-x-auto" style={{ fontSize: `${fontSize}px` }}>
                            <code>{codeToDisplay}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureCodePanel;
