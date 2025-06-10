
import React from 'react';
import { Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassmorphicCard from './GlassmorphicCard';

const CompanyHeader: React.FC = () => {
  return (
    <div className="text-center relative z-10 mb-12" data-aos="fade-up" data-aos-delay="100">
      <GlassmorphicCard variant="light" aosDelay={100} className="inline-block mb-6">
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
          className="icon-background rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto"
        >
          <Cloud className="h-12 w-12 text-white" />
        </motion.div>
      </GlassmorphicCard>
      
      <GlassmorphicCard variant="default" aosDelay={200} className="inline-block mb-6">
        <div className="p-8 rounded-3xl">
          <motion.h1 
            className="text-4xl md:text-5xl font-handwritten text-white mb-4 drop-shadow-lg"
            style={{ 
              color: 'rgba(255, 255, 255, 1)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
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
          
          <p 
            className="text-xl italic mb-6" 
            style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
              fontWeight: 500
            }}
          >
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
        <GlassmorphicCard variant="default" aosDelay={300}>
          <div className="p-8 rounded-3xl">
            <p 
              className="mb-4 leading-relaxed" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.85)',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Aigongbu는 혁신적인 교육 플랫폼으로, 전통적인 강의와 최첨단 AI 기술을 결합하여 
              학습자들에게 개인 맞춤형 학습 경험을 제공합니다.
            </p>
            <p 
              className="leading-relaxed" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.85)',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
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
