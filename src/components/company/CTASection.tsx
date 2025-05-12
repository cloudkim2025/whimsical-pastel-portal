
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import GlassmorphicCard from './GlassmorphicCard';

interface CTASectionProps {
  onStartFree: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartFree }) => {
  return (
    <section className="py-10 relative">
      {/* Decorative blurred orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-ghibli-sunset/40 rounded-full blur-3xl opacity-70"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-ghibli-forest/40 rounded-full blur-3xl opacity-70"></div>
      
      <GlassmorphicCard className="text-center p-8 relative z-10" variant="dark" depth={40}>
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-xl inline-block mb-8 border border-white/10 shadow-lg">
          <motion.h2 
            className="text-3xl md:text-4xl font-handwritten text-white mb-2 relative z-10"
            animate={{
              y: [0, -5, 0],
              scale: [1, 1.02, 1],
              rotateX: [0, 2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">함께 성장해요</span>
          </motion.h2>
        </div>
        
        <div className="bg-black/30 backdrop-blur-lg p-5 rounded-xl border border-white/10 shadow-inner max-w-2xl mx-auto relative z-10 mb-8">
          <p className="text-white text-lg font-medium">
            Aigongbu와 함께 당신의 기술 여정을 시작하세요. 
            우리는 당신이 꿈꾸는 미래로 가는 길을 밝혀줄 준비가 되어 있습니다.
          </p>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05, rotateX: 5 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block perspective-1000"
        >
          <Button 
            onClick={onStartFree}
            className="py-4 px-10 bg-ghibli-meadow hover:bg-ghibli-forest text-white rounded-full transition-all duration-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.4)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.6)] relative overflow-hidden group font-bold text-lg"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="relative z-10">무료로 시작하기</span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-ghibli-forest to-ghibli-stone opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 opacity-50 bg-gradient-to-b from-white/30 via-transparent to-transparent pointer-events-none rounded-full" />
          </Button>
        </motion.div>
        
        {/* Floating particles inside the card for additional depth */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full backdrop-blur-sm"
            animate={{
              x: [0, (i % 2 === 0 ? 100 : -100), 0],
              y: [0, (i % 3 === 0 ? 50 : -50), 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 8 - i,
              ease: "easeInOut"
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
      </GlassmorphicCard>
    </section>
  );
};

export default CTASection;
