
import React from "react";
import { MessageSquare } from "lucide-react";
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
}

const LectureChatPanel: React.FC<LectureChatPanelProps> = ({
  messages,
  userInput,
  setUserInput,
  isProcessing,
  onSendMessage,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-ghibli-forest text-white"
                    : msg.role === "system"
                    ? "bg-ghibli-cloud/70 text-ghibli-midnight"
                    : "bg-ghibli-cloud text-ghibli-midnight"
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-ghibli-cloud text-ghibli-midnight">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-ghibli-forest animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-ghibli-forest animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-ghibli-forest animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-border bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="질문을 입력하세요..."
            className="flex-1 px-3 py-2 rounded-l-md border border-border focus:outline-none focus:border-ghibli-forest"
            disabled={isProcessing}
          />
          <Button
            onClick={onSendMessage}
            disabled={!userInput.trim() || isProcessing}
            className="rounded-l-none rounded-r-md bg-ghibli-forest hover:bg-ghibli-forest/90"
          >
            전송
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LectureChatPanel;
