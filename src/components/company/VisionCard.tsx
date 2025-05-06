
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

const VisionCard: React.FC = () => {
  return (
    <Card className="mb-8 overflow-hidden border border-ghibli-meadow/20 shadow-lg">
      <div className="bg-gradient-to-r from-ghibli-cloud to-ghibli-sky-blue p-6">
        <div className="flex items-center mb-4">
          <Target className="h-8 w-8 text-ghibli-forest mr-4" />
          <h2 className="text-2xl font-handwritten text-ghibli-forest">우리의 비전</h2>
        </div>
        <CardContent className="p-0">
          <p className="text-ghibli-midnight leading-relaxed">
            Aigongbu는 교육의 경계를 허물고 모든 사람들이 기술을 배울 수 있는 기회를 제공하는 것을 목표로 합니다. 
            우리는 전통적인 학습 방식과 최신 AI 기술을 결합하여 보다 개인화되고 효과적인 학습 경험을 제공합니다.
            마치 지브리 애니메이션처럼 꿈과 현실의 경계에서 새로운 가능성을 탐색하듯, 우리는 교육이 단순한 지식 전달을 넘어
            창의성과 영감을 불어넣는 여정이 되기를 바랍니다.
          </p>
        </CardContent>
      </div>
    </Card>
  );
};

export default VisionCard;
