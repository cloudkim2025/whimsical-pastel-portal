
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
      <GlassmorphicCard className="text-center p-8" variant="default" aosDelay={200}>
        <div data-aos="zoom-in" data-aos-delay="200">
          {/* Decorative elements */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          
          <GlassmorphicCard variant="light" className="p-8 rounded-2xl mb-8">
            <motion.h2 
              className="text-2xl md:text-3xl font-handwritten mb-2 relative z-10"
              style={{ 
                color: 'rgba(255, 255, 255, 1)',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                fontWeight: 700,
                letterSpacing: '-0.02em'
              }}
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
          </GlassmorphicCard>
          
          <GlassmorphicCard variant="default" className="p-6 rounded-2xl mb-8 max-w-2xl mx-auto">
            <p 
              className="leading-relaxed relative z-10" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.85)',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Aigongbu와 함께 당신의 기술 여정을 시작하세요. 
              우리는 당신이 꿈꾸는 미래로 가는 길을 밝혀줄 준비가 되어 있습니다.
            </p>
          </GlassmorphicCard>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Button 
              onClick={onStartFree}
              className="glass-button py-4 px-10 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group font-bold text-lg"
              style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                fontWeight: 500
              }}
            >
              <span className="relative z-10">무료로 시작하기</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
              />
            </Button>
          </motion.div>
        </div>
      </GlassmorphicCard>
    </section>
  );
};

export default CTASection;
