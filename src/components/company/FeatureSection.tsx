
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
            aosDelay={200 + (index * 100)}
          >
            <div className="flex flex-col p-8" data-aos="fade-up" data-aos-delay={200 + (index * 100)}>
              <div className="flex items-center mb-4">
                <div className="icon-background rounded-2xl p-4">
                  {feature.icon}
                </div>
                
                <h3 
                  className="text-xl font-handwritten ml-4 drop-shadow-md" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 1)',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {feature.title}
                </h3>
              </div>
              
              <GlassmorphicCard variant="light" className="p-5 rounded-2xl">
                <p 
                  className="leading-relaxed" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                    lineHeight: 1.6,
                    fontWeight: 400
                  }}
                >
                  {feature.description}
                </p>
              </GlassmorphicCard>
            </div>
          </GlassmorphicCard>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
