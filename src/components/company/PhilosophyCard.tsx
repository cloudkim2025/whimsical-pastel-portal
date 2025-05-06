
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const PhilosophyCard: React.FC = () => {
  return (
    <Card className="mb-12 border border-ghibli-meadow/20 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-ghibli-earth to-ghibli-stone/30 p-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="h-8 w-8 text-ghibli-forest mr-4" />
          <h2 className="text-2xl font-handwritten text-ghibli-forest">교육 철학</h2>
        </div>
        <CardContent className="p-0 text-ghibli-midnight space-y-4">
          <p>
            우리는 학습이 단순한 정보 전달이 아닌 영감을 주는 과정이라고 믿습니다. 
            마치 지브리 스튜디오의 애니메이션이 관객에게 꿈과 상상력을 불어넣듯,
            우리의 교육은 학생들에게 새로운 세계를 탐험할 수 있는 용기와 창의력을 심어줍니다.
          </p>
          <p>
            기술은 빠르게 변화하지만, 학습의 본질은 변하지 않습니다. 
            우리는 최신 기술을 활용하되, 언제나 사람과 그들의 이야기에 초점을 맞춥니다.
            모든 학생이 자신만의 이야기를 써내려갈 수 있도록 돕는 것이 우리의 사명입니다.
          </p>
        </CardContent>
      </div>
    </Card>
  );
};

export default PhilosophyCard;
