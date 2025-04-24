
import React from "react";
import { FileCode, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LectureCodePanelProps {
  title: string;
  code: string;
  onRefresh?: () => void;
}

const LectureCodePanel: React.FC<LectureCodePanelProps> = ({
  title,
  code,
  onRefresh,
}) => (
  <div className="h-full flex flex-col">
    <div className="border-b border-border p-2 flex justify-between items-center bg-ghibli-midnight/5">
      <div className="flex items-center">
        <FileCode className="h-4 w-4 mr-2 text-ghibli-forest" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="flex-1 overflow-auto bg-[#1E1E1E] p-4">
      <pre className="text-[#D4D4D4] font-mono text-sm whitespace-pre overflow-x-auto min-h-[400px]">
        <code>{code || "// 코드가 로드되지 않았습니다."}</code>
      </pre>
    </div>
  </div>
);

export default LectureCodePanel;
