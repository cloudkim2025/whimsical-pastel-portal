
import React, { useRef, useEffect, useState } from "react";
import { MessageSquare, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    return (
        <div className="flex flex-col h-full">
            <div className="border-b border-border p-2 flex justify-between items-center bg-ghibli-midnight/5">
                <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-ghibli-forest" />
                    <span className="text-sm font-medium">AI 코드 튜터</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={onNewChatSession}
                    aria-label="새 세션 시작"
                    title="새 세션 시작"
                >
                    <Plus className="h-4 w-4 text-ghibli-forest" />
                </Button>
            </div>

            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-4 bg-white scroll-smooth"
                style={{ maxHeight: "calc(100vh - 200px)" }}
            >
                <div className="space-y-4">
                    {(messages || []).map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} fade-slide`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                    msg.role === "user"
                                        ? "bg-ghibli-forest text-white"
                                        : msg.role === "system"
                                            ? "bg-ghibli-cloud/70 text-ghibli-midnight"
                                            : "bg-ghibli-cloud text-ghibli-midnight"
                                }`}
                            >
                                <div className="whitespace-pre-line break-words">{msg.content}</div>
                            </div>
                        </div>
                    ))}

                    {isProcessing && (
                        <div className="flex justify-start fade-slide">
                            <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-ghibli-cloud text-ghibli-midnight animate-pulse">
                                <span>아이공이 타이핑 중{typingIndicator}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3 border-t border-border bg-white">
                <div className="flex items-end rounded-2xl border border-border overflow-hidden transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-ghibli-forest">
                    <textarea
                        ref={inputRef}
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="질문을 입력하세요..."
                        className="flex-1 px-4 py-2 text-sm resize-none bg-transparent focus:outline-none animate-blink"
                        style={{ minHeight: "40px", maxHeight: "200px", overflowY: "auto" }}
                        disabled={isProcessing}
                    />
                    <button
                        onClick={sendAndFocus}
                        disabled={!userInput.trim() || isProcessing}
                        className="p-2 bg-ghibli-forest hover:bg-ghibli-forest/90 text-white transition-colors disabled:opacity-50"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes blink {
                    0%, 100% { border-color: #9ca3af; }
                    50% { border-color: #1f2937; }
                }
                .animate-blink:focus {
                    animation: blink 1s infinite;
                }
                @keyframes fadeSlideIn {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .fade-slide {
                    animation: fadeSlideIn 0.3s ease forwards;
                }
            `}</style>
        </div>
    );
};

export default LectureChatPanel;
