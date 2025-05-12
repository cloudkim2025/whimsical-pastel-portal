
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import GlassmorphicCard from './GlassmorphicCard';

const VisionSection: React.FC = () => {
  return (
    <section className="py-10">
      <GlassmorphicCard className="overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 p-6">
          <motion.div 
            className="w-full md:w-1/2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-3xl font-handwritten text-ghibli-cloud mb-4">우리의 비전</h2>
            <p className="text-white/90 mb-4">
              Aigongbu는 전통적인 교육 방식과 최신 AI 기술을 융합하여, 모든 학습자에게 
              개인화된 학습 경험을 제공하는 혁신적인 플랫폼입니다.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {['창의적', '혁신적', '개인화된'].map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs rounded-full bg-ghibli-meadow/30 text-ghibli-cloud border border-ghibli-meadow/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2 perspective-1000"
            whileHover={{ rotateY: 5, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="relative h-60 w-full rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-ghibli-sky-blue/40 to-ghibli-meadow/40 mix-blend-overlay"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-20 w-20 text-white/70" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/30 to-transparent">
                <p className="text-white text-center font-medium">미래를 향한 교육 혁신</p>
              </div>
            </div>
          </motion.div>
        </div>
      </GlassmorphicCard>
    </section>
  );
};

export default VisionSection;
