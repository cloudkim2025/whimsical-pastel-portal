
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({ 
  className, 
  children, 
  delay = 0,
  yOffset = 30,
  direction = 'up'
}) => {
  // Calculate initial animation values based on direction
  const getDirectionValues = () => {
    switch (direction) {
      case 'left':
        return { x: -30, y: 0 };
      case 'right':
        return { x: 30, y: 0 };
      case 'down':
        return { x: 0, y: -yOffset };
      case 'up':
      default:
        return { x: 0, y: yOffset };
    }
  };

  const { x, y } = getDirectionValues();
  
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        type: 'spring',
        stiffness: 50
      }}
      className={cn(
        "relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden", 
        className
      )}
    >
      {/* Inner light effect */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassmorphicCard;
