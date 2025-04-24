
import React from "react";
import { Code } from "lucide-react";

interface Session {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  code: string;
}

interface LectureSidebarProps {
  sessions: Session[];
  activeSession: Session;
  selectSession: (session: Session) => void;
  isCollapsed: boolean;
}

const LectureSidebar: React.FC<LectureSidebarProps> = ({
  sessions,
  activeSession,
  selectSession,
  isCollapsed,
}) => {
  return (
    <div
      className={`h-full bg-white border-r border-border transition-all duration-300 ease-in-out 
        ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-[260px] opacity-100'}`}
    >
      <div className="h-14 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-ghibli-forest" />
          <span className="font-medium text-ghibli-forest">AI 코드 분석</span>
        </div>
      </div>

      <div
        className="pt-2 px-2 overflow-y-auto"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <div className="space-y-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => selectSession(session)}
              className={`w-full text-left flex items-center gap-2 overflow-hidden rounded-md p-2 text-sm hover:bg-sidebar-accent
                ${session.id === activeSession.id ? 'bg-sidebar-accent font-medium' : ''}`}
            >
              <Code className="h-4 w-4" />
              <span className="truncate">{session.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LectureSidebar;
