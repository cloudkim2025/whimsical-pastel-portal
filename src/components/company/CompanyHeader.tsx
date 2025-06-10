import React from 'react';
import { Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassmorphicCard from './GlassmorphicCard';

const CompanyHeader: React.FC = () => {
  return (
    <div className="text-center relative z-10 mb-12">
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
        className="rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(25px) saturate(180%)',
          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.2),
            0 2px 16px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 rgba(255, 255, 255, 0.2)
          `
        }}
      >
        <Cloud className="h-12 w-12 text-white drop-shadow-lg" />
      </motion.div>
      
      <GlassmorphicCard variant="default" className="inline-block mb-6">
        <div className="p-8 rounded-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Aigongbu
          </h1>
          <p className="text-xl text-white">
            "인터넷 강의 및 AI와 함께 공부"
          </p>
        </div>
      </GlassmorphicCard>

      <motion.div 
        className="mt-10 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <GlassmorphicCard variant="default" className="mb-6">
          <div className="p-8 rounded-3xl">
            <p className="mb-4 leading-relaxed text-white">
              Aigongbu는 혁신적인 교육 플랫폼으로, 전통적인 강의와 최첨단 AI 기술을 결합하여 
              학습자들에게 개인 맞춤형 학습 경험을 제공합니다.
            </p>
            <p className="leading-relaxed text-white">
              우리는 모든 사람이 자신의 잠재력을 최대한 발휘할 수 있도록 지원하는 
              교육 생태계를 구축하기 위해 노력하고 있습니다.
            </p>
          </div>
        </GlassmorphicCard>
      </motion.div>
    </div>
  );
};

export default CompanyHeader;
