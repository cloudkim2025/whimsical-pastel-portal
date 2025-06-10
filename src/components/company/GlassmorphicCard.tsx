
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  variant?: 'default' | 'dark' | 'light';
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({ 
  className, 
  children, 
  delay = 0,
  yOffset = 30,
  direction = 'up',
  variant = 'default'
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
  
  // Get background style based on variant
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'dark':
        return "bg-white/10 backdrop-blur-xl border border-white/20";
      case 'light':
        return "bg-white/20 backdrop-blur-xl border border-white/30";
      default:
        return "bg-white/15 backdrop-blur-xl border border-white/25";
    }
  };
  
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
        "relative rounded-3xl overflow-hidden", 
        getBackgroundStyle(),
        "shadow-xl shadow-black/10",
        "before:absolute before:inset-0 before:rounded-3xl before:border before:border-white/40 before:opacity-50",
        "after:absolute after:inset-px after:rounded-3xl after:bg-gradient-to-br after:from-white/20 after:via-transparent after:to-transparent after:pointer-events-none",
        className
      )}
      style={{
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.12),
          0 2px 16px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          inset 0 -1px 0 rgba(255, 255, 255, 0.1)
        `
      }}
    >
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent opacity-60 pointer-events-none rounded-3xl" />
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassmorphicCard;
