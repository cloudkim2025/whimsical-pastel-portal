
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Code, Bot, Users } from 'lucide-react';

const FeatureCards: React.FC = () => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {}
      }}
    >
      <motion.div
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 20 }
        }}
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Book className="h-6 w-6 text-ghibli-forest mr-3" />
              <h3 className="text-xl font-handwritten text-ghibli-forest">맞춤형 학습 경험</h3>
            </div>
            <p className="text-ghibli-midnight">
              개인의 학습 속도와 스타일에 맞춘 교육 컨텐츠로 효과적인 학습을 지원합니다.
              각자의 강점과 약점을 파악하여 최적화된 학습 경로를 제공합니다.
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 20 }
        }}
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Code className="h-6 w-6 text-ghibli-forest mr-3" />
              <h3 className="text-xl font-handwritten text-ghibli-forest">실무 중심 교육</h3>
            </div>
            <p className="text-ghibli-midnight">
              산업 현장에서 실제로 사용되는 도구와 기술을 배우며, 
              실습 중심의 프로젝트를 통해 실질적인 역량을 키울 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 20 }
        }}
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Bot className="h-6 w-6 text-ghibli-forest mr-3" />
              <h3 className="text-xl font-handwritten text-ghibli-forest">AI 통합 학습</h3>
            </div>
            <p className="text-ghibli-midnight">
              최신 AI 기술을 활용한 맞춤형 학습 도우미와 함께
              24시간 질문하고 답변받을 수 있는 환경을 제공합니다.
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 20 }
        }}
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-ghibli-forest mr-3" />
              <h3 className="text-xl font-handwritten text-ghibli-forest">활발한 커뮤니티</h3>
            </div>
            <p className="text-ghibli-midnight">
              함께 공부하는 동료들과 지식을 나누고 성장할 수 있는
              활발한 커뮤니티 활동을 지원합니다.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FeatureCards;
