
import React from 'react';
import { MessagesSquare, Bot, Clock, Star } from 'lucide-react';

const featureData = [
  {
    icon: <Bot className="h-8 w-8 text-ghibli-sunset" />,
    title: "AI 자동 요약",
    description: "강의 내용을 AI가 자동으로 요약해주어 핵심 내용을 빠르게 파악하고 효율적인 학습이 가능합니다."
  },
  {
    icon: <MessagesSquare className="h-8 w-8 text-ghibli-forest" />,
    title: "AI 실시간 질의응답",
    description: "학습 중 궁금한 점이 생기면 언제든지 AI에게 질문하고 즉시 응답을 받을 수 있습니다."
  },
  {
    icon: <Star className="h-8 w-8 text-ghibli-earth" />,
    title: "전문화된 AI 조교",
    description: "각 강의에는 해당 분야에 특화된 AI 조교가 배정되어 전문적인 도움을 제공합니다."
  },
  {
    icon: <Clock className="h-8 w-8 text-ghibli-sky-blue" />,
    title: "시간 제약 없는 수강",
    description: "언제 어디서나 원하는 시간에 학습할 수 있고, AI 조교는 24시간 도움을 제공합니다."
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-ghibli-cloud/30 to-white/0 -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-ghibli-midnight mb-4 korean-text">왜 우리 교육 서비스를 선택해야 할까요?</h2>
          <p className="text-ghibli-stone text-lg max-w-2xl mx-auto korean-text">
            AI 기술과 교육의 시너지를 통해 더 효율적이고 개인화된 학습 경험을 제공하는 차별화된 교육 플랫폼입니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureData.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card opacity-0" 
              style={{ 
                animation: 'slide-up 1s ease-out forwards',
                animationDelay: `${0.2 * index}s` 
              }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-ghibli-midnight mb-3 korean-text">{feature.title}</h3>
              <p className="text-ghibli-stone korean-text">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-handwritten font-bold text-ghibli-midnight mb-6 korean-text">
            "배움의 여정에 AI가 함께하면, 더 넓은 세계로 나아갈 수 있습니다."
          </h3>
          <p className="text-ghibli-stone italic korean-text">- 교육 AI 연구팀</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
