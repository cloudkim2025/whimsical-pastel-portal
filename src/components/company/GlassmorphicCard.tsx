
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
  depth?: number; // New prop for 3D depth
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({ 
  className, 
  children, 
  delay = 0,
  yOffset = 30,
  direction = 'up',
  variant = 'default',
  depth = 20
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
  
  // Get background style based on variant - enhanced for better glassmorphism
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'dark':
        return "bg-black/30 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]";
      case 'light':
        return "bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]";
      default:
        return "bg-white/15 backdrop-blur-xl border border-white/25 shadow-[0_8px_32px_0_rgba(31,38,135,0.20)]";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x, y, scale: 0.97 }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0, 
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        z: 0
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        type: 'spring',
        stiffness: 50
      }}
      whileHover={{
        scale: 1.02,
        rotateX: 2,
        rotateY: 2,
        z: depth,
        transition: { duration: 0.4 }
      }}
      className={cn(
        "relative rounded-2xl overflow-hidden transform-gpu will-change-transform", 
        getBackgroundStyle(),
        className
      )}
      style={{
        transformStyle: "preserve-3d"
      }}
    >
      {/* Frosted glass inner border effect */}
      <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none rounded-2xl" />
      
      {/* Extra inner glow effect */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-2xl" />
      
      {/* Content container with improved text readability */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassmorphicCard;
