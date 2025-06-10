
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Bot, Users } from 'lucide-react';
import GlassmorphicCard from './GlassmorphicCard';

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Book className="h-8 w-8 text-white" />,
      title: "맞춤형 학습 경험",
      description: "개인의 학습 속도와 스타일에 맞춘 교육 컨텐츠로 효과적인 학습을 지원합니다. 각자의 강점과 약점을 파악하여 최적화된 학습 경로를 제공합니다."
    },
    {
      icon: <Code className="h-8 w-8 text-white" />,
      title: "실무 중심 교육",
      description: "산업 현장에서 실제로 사용되는 도구와 기술을 배우며, 실습 중심의 프로젝트를 통해 실질적인 역량을 키울 수 있습니다."
    },
    {
      icon: <Bot className="h-8 w-8 text-white" />,
      title: "AI 통합 학습",
      description: "최신 AI 기술을 활용한 맞춤형 학습 도우미와 함께 24시간 질문하고 답변받을 수 있는 환경을 제공합니다."
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "활발한 커뮤니티",
      description: "함께 공부하는 동료들과 지식을 나누고 성장할 수 있는 활발한 커뮤니티 활동을 지원합니다."
    }
  ];

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <GlassmorphicCard 
            key={index} 
            delay={0.1 * index}
            direction={index % 2 === 0 ? 'left' : 'right'}
            variant="default"
            className="p-0"
          >
            <div className="flex flex-col p-8">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-handwritten text-white ml-4 drop-shadow-md">
                  {feature.title}
                </h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20">
                <p className="text-white/90 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </GlassmorphicCard>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
