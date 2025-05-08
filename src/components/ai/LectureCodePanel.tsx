import React, { useState, useRef, useEffect } from "react";
import { FileCode, RefreshCw, Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatSessionMeta } from "@/types/userChatSession";
import { SessionMeta } from "@/types/session";
import { Typewriter } from "react-simple-typewriter";
import { motion, AnimatePresence } from "framer-motion";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, historyKeymap } from "@codemirror/commands";
import { foldGutter, foldKeymap } from "@codemirror/language";

interface LectureCodePanelProps {
    session: ChatSessionMeta | SessionMeta | null;
    onRefresh?: () => void;
}

const LectureCodePanel: React.FC<LectureCodePanelProps> = ({ session, onRefresh }) => {
    const [copied, setCopied] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const editorViewRef = useRef<EditorView | null>(null);
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

    // 에디터 초기화 및 업데이트를 통합 관리
    useEffect(() => {
        const initializeEditor = () => {
            if (!editorContainerRef.current) return;

            // 기존 에디터 인스턴스가 있으면 파괴
            if (editorViewRef.current) {
                editorViewRef.current.destroy();
                editorViewRef.current = null;
            }

            const startState = EditorState.create({
                doc: codeToDisplay,
                extensions: [
                    lineNumbers(),
                    foldGutter(),
                    javascript(),
                    oneDark,
                    keymap.of([
                        ...defaultKeymap,
                        ...historyKeymap,
                        ...foldKeymap
                    ]),
                    EditorView.lineWrapping,
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            // console.log("document changed", update.state.doc.toString());
                        }
                    })
                ],
            });

            const view = new EditorView({
                state: startState,
                parent: editorContainerRef.current,
            });

            editorViewRef.current = view;
        };

        // 폰트 크기가 변경되었거나, 세션 ID가 변경되었을 경우에만 에디터 초기화
        if (prevFontSizeRef.current !== fontSize || prevSessionIdRef.current !== currentSessionId) {
            initializeEditor();
            prevFontSizeRef.current = fontSize;
            prevSessionIdRef.current = currentSessionId;
        } else if (editorViewRef.current && editorViewRef.current.state.doc.toString() !== codeToDisplay) {
            // 내용이 변경되었을 경우에만 내용 업데이트
            editorViewRef.current.dispatch({
                changes: { from: 0, to: editorViewRef.current.state.doc.length, insert: codeToDisplay },
            });
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
                            className="codemirror-editor-container"
                            style={{ position: 'relative', zIndex: 1, minHeight: '200px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureCodePanel;
