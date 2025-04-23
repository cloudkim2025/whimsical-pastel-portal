
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Code, 
  FileCode, 
  History, 
  ChevronRight 
} from 'lucide-react';

interface Session {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  code: string;
}

interface AIHistorySidebarProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (session: Session) => void;
}

const AIHistorySidebar: React.FC<AIHistorySidebarProps> = ({ 
  sessions, 
  activeSessionId, 
  onSelectSession 
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center">
        <Code className="h-5 w-5 mr-2 text-ghibli-forest" />
        <h2 className="font-semibold text-ghibli-forest">AI 코드 분석</h2>
      </div>
      
      <Tabs defaultValue="history" className="flex-1">
        <div className="px-2 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="history" className="flex-1">
              <History className="h-4 w-4 mr-1" />
              기록
            </TabsTrigger>
            <TabsTrigger value="outline" className="flex-1">
              <FileCode className="h-4 w-4 mr-1" />
              개요
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="history" className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-ghibli-stone px-2 py-1">최근 분석</h3>
            {sessions.map((session) => (
              <button
                key={session.id}
                className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                  session.id === activeSessionId
                    ? 'bg-ghibli-meadow/20 text-ghibli-forest'
                    : 'hover:bg-ghibli-cloud/50'
                }`}
                onClick={() => onSelectSession(session)}
              >
                <Code className="h-4 w-4 mr-2 flex-shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-medium truncate">{session.title}</div>
                  <div className="text-xs text-ghibli-stone truncate">{session.summary}</div>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="outline" className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-ghibli-stone px-2 py-1">코드 구조</h3>
            <div className="px-2 py-1 text-sm">
              <div className="flex items-center py-1">
                <ChevronRight className="h-3 w-3 mr-1" />
                <span>컴포넌트 정의</span>
              </div>
              <div className="flex items-center pl-4 py-1 text-ghibli-forest">
                <span>ExpensiveComponent()</span>
              </div>
              <div className="flex items-center py-1">
                <ChevronRight className="h-3 w-3 mr-1" />
                <span>훅 사용</span>
              </div>
              <div className="flex items-center pl-4 py-1 text-ghibli-forest">
                <span>useMemo()</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIHistorySidebar;
