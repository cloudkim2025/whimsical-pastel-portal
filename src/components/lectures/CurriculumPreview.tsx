
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CurriculumPreviewProps {
  curriculum: string[];
}

const CurriculumPreview: React.FC<CurriculumPreviewProps> = ({ curriculum }) => {
  if (!curriculum || curriculum.length === 0) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 korean-text">AI 생성 커리큘럼</h3>
        <ul className="space-y-2 korean-text">
          {curriculum.map((item, index) => (
            <li key={index} className="p-2 bg-muted/50 rounded-md">{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CurriculumPreview;
