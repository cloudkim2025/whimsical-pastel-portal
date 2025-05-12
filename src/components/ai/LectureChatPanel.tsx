
import React, { useRef, useEffect, useState } from "react";
import { MessageSquare, Plus, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}

interface LectureChatPanelProps {
    messages: Message[];
    userInput: string;
    setUserInput: (input: string) => void;
    isProcessing: boolean;
    onSendMessage: () => void;
    onNewChatSession: () => void;
}

const LectureChatPanel: React.FC<LectureChatPanelProps> = ({
    messages,
    userInput,
    setUserInput,
    isProcessing,
    onSendMessage,
    onNewChatSession,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [typingIndicator, setTypingIndicator] = useState("");

    useEffect(() => {
        const c = containerRef.current;
        if (c) c.scrollTop = c.scrollHeight;
    }, [messages, typingIndicator]);

    useEffect(() => {
        const input = inputRef.current;
        if (input) {
            input.style.height = "auto";
            input.style.height = input.scrollHeight + "px";
        }
    }, [userInput]);

    useEffect(() => {
        if (!isProcessing) {
            inputRef.current?.focus();
        }
    }, [isProcessing]);

    useEffect(() => {
        if (isProcessing) {
            let index = 0;
            const interval = setInterval(() => {
                setTypingIndicator(".".repeat((index % 3) + 1));
                index++;
            }, 500);
            return () => clearInterval(interval);
        } else {
            setTypingIndicator("");
        }
    }, [isProcessing]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendAndFocus();
        }
    };

    const sendAndFocus = () => {
        if (!isProcessing && userInput.trim()) {
            onSendMessage();
        }
    };

    // Animation variants
    const messageVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-indigo-50 to-slate-50">
            <div className="border-b p-3 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                <div className="flex items-center">
                    <div className="bg-indigo-500/10 p-1.5 rounded-full mr-2">
                        <MessageSquare className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">AI 코드 튜터</span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-500/10 hover:bg-indigo-500/20 p-1.5 rounded-full text-indigo-600 transition-colors"
                    onClick={onNewChatSession}
                    aria-label="새 세션 시작"
                    title="새 세션 시작"
                >
                    <Plus className="h-4 w-4" />
                </motion.button>
            </div>

            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-5 scroll-smooth"
                style={{ maxHeight: "calc(100vh - 200px)" }}
            >
                <AnimatePresence initial={false}>
                    <div className="space-y-5">
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-40 text-center p-6"
                            >
                                <Bot className="h-12 w-12 text-indigo-300 mb-4" />
                                <h3 className="text-lg font-medium text-slate-700 mb-2">AI 코드 튜터와 대화해보세요</h3>
                                <p className="text-sm text-slate-500">
                                    코드에 대한 궁금한 점을 물어보세요. AI가 도와드립니다.
                                </p>
                            </motion.div>
                        )}
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                variants={messageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                layout
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role !== "user" && (
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                                        <Bot className="h-4 w-4 text-indigo-600" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                                        msg.role === "user"
                                            ? "bg-indigo-600 text-white"
                                            : msg.role === "system"
                                                ? "bg-gray-100 text-slate-700 border border-gray-200"
                                                : "bg-white text-slate-700 border border-gray-200"
                                    }`}
                                >
                                    <div className="whitespace-pre-line break-words">{msg.content}</div>
                                </div>
                                {msg.role === "user" && (
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ml-2 mt-1 flex-shrink-0">
                                        <span className="text-white text-xs font-bold">You</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {isProcessing && (
                            <motion.div
                                variants={messageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex justify-start"
                            >
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1">
                                    <Bot className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-white text-slate-700 border border-gray-200 shadow-sm">
                                    <div className="flex items-center">
                                        <div className="typing-animation mr-2">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <span className="text-slate-500 text-sm">아이공 생각 중{typingIndicator}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white/70 backdrop-blur-sm">
                <div className="flex items-end rounded-xl border border-gray-300 overflow-hidden transition-all focus-within:shadow-md focus-within:ring-2 focus-within:ring-indigo-400 bg-white">
                    <textarea
                        ref={inputRef}
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="질문을 입력하세요..."
                        className="flex-1 px-4 py-3 text-sm resize-none bg-transparent focus:outline-none"
                        style={{ minHeight: "40px", maxHeight: "200px", overflowY: "auto" }}
                        disabled={isProcessing}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={sendAndFocus}
                        disabled={!userInput.trim() || isProcessing}
                        className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 disabled:bg-gray-400"
                    >
                        <Send className="h-5 w-5" />
                    </motion.button>
                </div>
            </div>

            <style>{`
                .typing-animation {
                    display: flex;
                    align-items: center;
                }
                
                .typing-animation span {
                    height: 6px;
                    width: 6px;
                    background: #6366f1;
                    border-radius: 50%;
                    margin: 0 1px;
                    animation: bounce 1s infinite;
                }
                
                .typing-animation span:nth-child(2) {
                    animation-delay: 0.1s;
                }
                
                .typing-animation span:nth-child(3) {
                    animation-delay: 0.2s;
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
            `}</style>
        </div>
    );
};

export default LectureChatPanel;
