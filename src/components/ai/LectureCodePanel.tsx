
import React, { useState, useRef, useEffect } from "react";
import { FileCode, RefreshCw, Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatSessionMeta } from "@/types/userChatSession";
import { SessionMeta } from "@/types/session";
import { Typewriter } from "react-simple-typewriter";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface LectureCodePanelProps {
    session: ChatSessionMeta | SessionMeta | null;
    onRefresh?: () => void;
}

const LectureCodePanel: React.FC<LectureCodePanelProps> = ({ session, onRefresh }) => {
    const [copied, setCopied] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const prevSessionIdRef = useRef<string | null>(null);
    const prevFontSizeRef = useRef<number>(fontSize);

    // session.code가 변경될 때만 코드 업데이트하도록 변경
    const codeToDisplay = session && "code" in session && session.code ? session.code : "(코드 없음)";

    // 세션 ID 추출하는 함수
    const getSessionKey = () => {
        if (!session) return "empty";
        return "chat_session_id" in session ? session.chat_session_id : session.session_id;
    };

    const currentSessionId = getSessionKey();

    // Use a simpler code display approach to avoid dependency conflicts
    useEffect(() => {
        const initializeEditor = async () => {
            if (!editorContainerRef.current) return;
            
            // Clear previous content
            editorContainerRef.current.innerHTML = '';
            
            // Create pre element for code display with proper styling
            const pre = document.createElement('pre');
            pre.className = 'code-display';
            pre.style.margin = '0';
            pre.style.padding = '0.5rem';
            pre.style.overflow = 'auto';
            pre.style.backgroundColor = 'transparent';
            pre.style.color = '#D4D4D4';
            pre.style.fontFamily = 'monospace';
            pre.style.fontSize = `${fontSize}px`;
            pre.style.lineHeight = '1.5';
            pre.style.whiteSpace = 'pre-wrap';
            pre.style.wordBreak = 'break-word';
            
            // Format the code with line numbers
            const codeLines = codeToDisplay.split('\n');
            const formattedCode = codeLines.map((line, index) => {
                const lineNumber = index + 1;
                return `<span style="color: #666; user-select: none; display: inline-block; width: 2em; text-align: right; margin-right: 1em; opacity: 0.5;">${lineNumber}</span>${line}`;
            }).join('\n');
            
            pre.innerHTML = formattedCode;
            editorContainerRef.current.appendChild(pre);
        };

        // Only re-initialize when needed
        if (
            prevFontSizeRef.current !== fontSize || 
            prevSessionIdRef.current !== currentSessionId ||
            editorContainerRef.current?.childNodes.length === 0
        ) {
            initializeEditor();
            prevFontSizeRef.current = fontSize;
            prevSessionIdRef.current = currentSessionId;
        }
    }, [codeToDisplay, fontSize, currentSessionId]);

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
                            {session ? (
                                <Typewriter
                                    words={[session.summary || "(요약 없음)"]}
                                    loop={1}
                                    cursor
                                    typeSpeed={10}
                                    deleteSpeed={10}
                                />
                            ) : "// 세션이 선택되지 않았습니다."}
                        </code>
                    </div>

                    <div className="bg-gray-900 p-3 rounded relative">
                        <span className="block text-[#9CDCFE] font-semibold mb-2">[코드]</span>
                        <CopyToClipboard text={codeToDisplay} onCopy={() => {
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}>
                            <button className="absolute top-3 right-3 text-gray-400 hover:text-white z-10">
                                {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                            </button>
                        </CopyToClipboard>
                        <div
                            ref={editorContainerRef}
                            className="code-editor-container"
                            style={{ 
                                position: 'relative', 
                                zIndex: 1, 
                                minHeight: '200px',
                                backgroundColor: '#1E1E1E',
                                borderRadius: '0.25rem',
                                padding: '0.5rem'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureCodePanel;
