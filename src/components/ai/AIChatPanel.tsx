
import React, { useState } from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  onRefresh?: () => void;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ messages, onSendMessage, isProcessing, onRefresh }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-2 flex justify-between items-center bg-ghibli-midnight/5">
        <div className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2 text-ghibli-forest" />
          <span className="text-sm font-medium">AI 챗봇</span>
        </div>
        {onRefresh && (
          <div>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-ghibli-forest text-white'
                    : msg.role === 'system'
                    ? 'bg-ghibli-cloud/70 text-ghibli-midnight'
                    : 'bg-ghibli-cloud text-ghibli-midnight'
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
                  <div className="w-2 h-2 rounded-full bg-ghibli-forest animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-ghibli-forest animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-ghibli-forest animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="질문을 입력하세요..."
            className="flex-1 px-3 py-2 rounded-l-md border border-border focus:outline-none focus:border-ghibli-forest"
            disabled={isProcessing}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="rounded-l-none rounded-r-md bg-ghibli-forest hover:bg-ghibli-forest/90"
          >
            전송
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
