
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import GlassmorphicCard from './GlassmorphicCard';

interface CTASectionProps {
  onStartFree: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartFree }) => {
  return (
    <section className="py-10">
      <GlassmorphicCard className="text-center p-8">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-ghibli-sunset/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-ghibli-forest/20 rounded-full blur-3xl"></div>
        
        <motion.h2 
          className="text-2xl md:text-3xl font-handwritten text-ghibli-cloud mb-4 relative z-10"
          animate={{
            y: [0, -5, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          함께 성장해요
        </motion.h2>
        
        <p className="text-white/90 mb-6 max-w-2xl mx-auto relative z-10">
          Aigongbu와 함께 당신의 기술 여정을 시작하세요. 
          우리는 당신이 꿈꾸는 미래로 가는 길을 밝혀줄 준비가 되어 있습니다.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block"
        >
          <Button 
            onClick={onStartFree}
            className="py-3 px-8 bg-ghibli-meadow hover:bg-ghibli-forest text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
          >
            <span className="relative z-10">무료로 시작하기</span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-ghibli-forest to-ghibli-stone opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          </Button>
        </motion.div>
      </GlassmorphicCard>
    </section>
  );
};

export default CTASection;
