
import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  variant?: 'default' | 'dark' | 'light';
  aosDelay?: number;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({ 
  className, 
  children, 
  delay = 0,
  yOffset = 30,
  direction = 'up',
  variant = 'default',
  aosDelay = 0
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
  
  // Enhanced glassmorphism background style
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'dark':
        return "glassmorphic-card-dark";
      case 'light':
        return "glassmorphic-card-light";
      default:
        return "glassmorphic-card-default";
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
      data-aos="fade-up"
      data-aos-delay={aosDelay}
      className="tilt-wrapper"
    >
      <Tilt
        perspective={1000}
        scale={1.02}
        transitionSpeed={1000}
        gyroscope={true}
        glareEnable={true}
        glareMaxOpacity={0.3}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="24px"
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        tiltReverse={false}
        tiltAngleXInitial={0}
        tiltAngleYInitial={0}
        className="tilt-container w-full h-full"
      >
        <div
          className={cn(
            "relative rounded-3xl overflow-hidden w-full h-full glassmorphic-card", 
            getBackgroundStyle(),
            "before:absolute before:inset-0 before:rounded-3xl before:border before:border-white/50 before:opacity-60",
            "after:absolute after:inset-px after:rounded-3xl after:bg-gradient-to-br after:from-white/30 after:via-transparent after:to-transparent after:pointer-events-none",
            className
          )}
        >
          {/* Enhanced glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-70 pointer-events-none rounded-3xl" />
          
          {/* Content container */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

export default GlassmorphicCard;
