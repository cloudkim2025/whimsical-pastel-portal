
import React from 'react';
import { Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyHeader: React.FC = () => {
  return (
    <div className="text-center relative z-10 mb-6">
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotateZ: [0, 2, -2, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut" 
        }}
      >
        <Cloud className="h-16 w-16 text-ghibli-meadow mx-auto mb-4" />
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-handwritten text-ghibli-forest mb-4 drop-shadow-lg"
        animate={{ 
          scale: [1, 1.03, 1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut" 
        }}
      >
        Aigongbu
      </motion.h1>
      
      <p className="text-xl text-white italic mb-6 backdrop-blur">
        "인터넷 강의 및 AI와 함께 공부"
      </p>
      
      <motion.div 
        className="mt-8 max-w-2xl mx-auto text-white/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <p className="mb-4 leading-relaxed">
          Aigongbu는 혁신적인 교육 플랫폼으로, 전통적인 강의와 최첨단 AI 기술을 결합하여 
          학습자들에게 개인 맞춤형 학습 경험을 제공합니다.
        </p>
        <p className="leading-relaxed">
          우리는 모든 사람이 자신의 잠재력을 최대한 발휘할 수 있도록 지원하는 
          교육 생태계를 구축하기 위해 노력하고 있습니다.
        </p>
      </motion.div>
    </div>
  );
};

export default CompanyHeader;
