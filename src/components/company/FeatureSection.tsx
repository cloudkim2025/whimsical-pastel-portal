
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Book, Code, Bot, Users } from 'lucide-react';
import GlassmorphicCard from './GlassmorphicCard';

const FeatureSection: React.FC = () => {
  // Use scroll progress to create scroll-based animations
  const { scrollYProgress } = useScroll();
  
  // Create different transform values for different scroll positions
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  
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
    <section className="py-10 relative perspective-1000">
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 right-10 w-40 h-40 bg-ghibli-meadow/20 rounded-full blur-3xl"
        style={{
          rotate: useTransform(scrollYProgress, [0, 1], [0, 360]),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]),
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 left-10 w-40 h-40 bg-ghibli-forest/20 rounded-full blur-3xl"
        style={{
          rotate: useTransform(scrollYProgress, [0, 1], [0, -360]),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]),
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            style={{
              transformStyle: 'preserve-3d',
              rotateX: index % 2 === 0 ? rotateX : useTransform(scrollYProgress, [0, 1], [0, -5]),
              scale: index % 3 === 0 ? scale : 1,
              z: useTransform(scrollYProgress, [0, 0.5, 1], [0, index * 10, 0]),
            }}
          >
            <GlassmorphicCard 
              key={index} 
              delay={0.1 * index}
              direction={index % 2 === 0 ? 'left' : 'right'}
              variant={index % 2 === 0 ? 'dark' : 'light'}
              className="p-0 h-full"
              depth={20 + index * 5}
            >
              <div className="flex flex-col p-6 h-full">
                <div className="flex items-center mb-3 bg-ghibli-forest/25 backdrop-blur-md p-3 rounded-lg border border-white/10">
                  <div className="bg-gradient-to-br from-ghibli-forest to-ghibli-meadow rounded-full p-3 shadow-lg transform-gpu">
                    <motion.div
                      whileHover={{ rotateZ: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  
                  <h3 className="text-xl font-handwritten text-white ml-4 drop-shadow-md">
                    {feature.title}
                  </h3>
                </div>
                
                <div className="bg-black/20 backdrop-blur-xl p-4 rounded-lg border border-white/10 flex-grow">
                  <p className="text-white font-medium">
                    {feature.description}
                  </p>
                </div>
                
                {/* Interactive decorative element */}
                <motion.div 
                  className="absolute bottom-3 right-3 w-10 h-10 opacity-30"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full bg-white rounded-full blur-md" />
                </motion.div>
              </div>
            </GlassmorphicCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
