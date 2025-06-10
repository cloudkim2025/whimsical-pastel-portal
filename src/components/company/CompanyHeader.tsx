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
        className="bg-white/15 backdrop-blur-md rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-white/30"
      >
        <Cloud className="h-12 w-12 text-white" />
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
    </div>
  );
};

export default CompanyHeader;
