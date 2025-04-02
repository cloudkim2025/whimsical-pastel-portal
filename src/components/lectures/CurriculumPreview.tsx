
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, ListItem } from 'lucide-react';

interface CurriculumPreviewProps {
  curriculum: string[];
}

const CurriculumPreview: React.FC<CurriculumPreviewProps> = ({ curriculum }) => {
  if (!curriculum || curriculum.length === 0) {
    return null;
  }

  return (
    <Card className="border-ghibli-meadow/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-ghibli-forest korean-text">
          <List className="h-5 w-5" />
          AI 자동 생성 커리큘럼
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {curriculum.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-ghibli-forest font-medium min-w-6">{index + 1}.</span>
              <span className="text-ghibli-midnight korean-text">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CurriculumPreview;
