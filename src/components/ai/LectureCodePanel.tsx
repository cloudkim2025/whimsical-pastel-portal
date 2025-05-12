import React, { useState, useRef, useEffect } from "react";
import { FileCode, Zap, Clipboard, Check, Code2, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatSessionMeta } from "@/types/userChatSession";
import { SessionMeta } from "@/types/session";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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

    const LectureCodePanel: React.FC<LectureCodePanelProps> = ({
        session,
        onRefresh
    }) => {
    const [copied, setCopied] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [tab, setTab] = useState<'summary' | 'code' | 'analysis'>('summary');
    const { toast } = useToast();

    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const editorViewRef = useRef<EditorView | null>(null);
    const prevSessionIdRef = useRef<string | null>(null);
    const prevFontSizeRef = useRef<number>(fontSize);

    const [summary, setSummary] = useState<string>("(요약 없음)");
    const [isTypingComplete, setIsTypingComplete] = useState(false); // 애니메이션 완료 여부 추적

    // 코드 클립보드에 복사하는 함수
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => {
                setCopied(true);
                toast({
                    title: "복사 완료",
                    description: "코드가 클립보드에 복사되었습니다.",
                    variant: "default",
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

    // 우선순위: summaryContent → session.summary, codeContent → session.code
        const summaryToDisplay = session
            ? session.summary || "(요약 없음)"
            : "// 세션이 선택되지 않았습니다.";

        const codeToDisplay = session && "code" in session && session.code
            ? session.code
            : "(코드 없음)";

    // 에디터 초기화 및 업데이트를 통합 관리
    useEffect(() => {
        // 기본 설정 함수 (폰트 크기에 따라 동적 생성)
        const createBasicSetup = (size: number) => [
            lineNumbers(), // 줄번호 추가
            foldGutter(), // 코드 접기 기능 추가
            keymap.of([...defaultKeymap, ...historyKeymap, ...foldKeymap]), // 기본 키맵 및 코드 접기 추가
            javascript(), // 자바스크립트 문법 하이라이팅 추가
            oneDark, // 다크 테마 추가
            EditorView.theme({
                "&": { fontSize: `${size}px` },
            }),
        ];

        const initializeEditor = () => {
            if (editorContainerRef.current) {
                // 기존 에디터 제거
                if (editorViewRef.current) {
                    editorViewRef.current.destroy();
                }

                // 새 에디터 생성
                const state = EditorState.create({
                    doc: codeToDisplay,
                    extensions: createBasicSetup(fontSize),
                });

                const view = new EditorView({
                    state,
                    parent: editorContainerRef.current,
                });

                editorViewRef.current = view;
                prevSessionIdRef.current = getSessionKey();
                prevFontSizeRef.current = fontSize;
            }
        };

        const updateEditorContent = () => {
            if (editorViewRef.current) {
                // 내용만 업데이트
                const transaction = editorViewRef.current.state.update({
                    changes: { from: 0, to: editorViewRef.current.state.doc.length, insert: codeToDisplay },
                });
                editorViewRef.current.dispatch(transaction);
                prevSessionIdRef.current = getSessionKey();
            }
        };

        // session.summary가 변경될 때마다 요약을 업데이트
        if (session && session.summary) {
            setSummary(session.summary);
            setIsTypingComplete(false); // 새로운 summary가 들어오면 애니메이션을 다시 시작
        }

        // 초기 생성 또는 세션 ID가 변경된 경우
        if (!editorViewRef.current || prevSessionIdRef.current !== getSessionKey()) {
            initializeEditor();
        }

        // 폰트 크기만 변경된 경우
        else if (prevFontSizeRef.current !== fontSize) {
            initializeEditor(); // 폰트 크기 변경은 에디터 재생성으로 처리
            prevFontSizeRef.current = fontSize;
        }

        // 코드 탭이 클릭되었을 때 코드 에디터에 내용을 업데이트
        if (tab === 'code' && editorViewRef.current) {
            updateEditorContent();
        }

        return () => {
            // 컴포넌트 언마운트 시 에디터 정리
            if (editorViewRef.current && editorContainerRef.current === null) {
                editorViewRef.current.destroy();
                editorViewRef.current = null;
            }
        };
    }, [codeToDisplay, fontSize, session?.summary, tab]); // `tab` 상태도 의존성에 추가

    useEffect(() => {
        if (tab === 'code' && editorViewRef.current) {
            const tr = editorViewRef.current.state.update({
                changes: {
                    from: 0,
                    to: editorViewRef.current.state.doc.length,
                    insert: codeToDisplay
                }
            });
            editorViewRef.current.dispatch(tr);
        }
    }, [tab, codeToDisplay]);

    const handleTypingDone = () => {
        setIsTypingComplete(true); // 애니메이션이 끝났을 때 상태 업데이트
    };

    const tabVariants = {
        inactive: { opacity: 0.7, y: 5 },
        active: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 25 } }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const getSessionKey = () => {
        if (!session) return "empty";
        return "chat_session_id" in session ? session.chat_session_id : session.session_id;
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

                <div className="flex items-center justify-center space-x-2">
                    {onRefresh && session && "chat_session_id" in session && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-auto px-2 text-gray-300 hover:text-white hover:bg-gray-700"
                            onClick={onRefresh}
                            title="분석하기"
                        >
                            <Zap className="h-4 w-4 mr-1" />
                            <span className="text-xs">분석하기</span>
                        </Button>
                    )}

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setFontSize(s => Math.max(s - 2, 10))}
                        className="text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                        A-
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setFontSize(s => Math.min(s + 2, 24))}
                        className="text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                        A+
                    </Button>
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
                            <span className="text-sm font-medium text-indigo-300 tracking-wide">최신 문서 요약</span>
                            <span className="ml-2 bg-indigo-600/30 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">
                                설명이 필요한땐 아이공
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
                            <div ref={editorContainerRef} className="codemirror-editor-container" />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default LectureCodePanel;
