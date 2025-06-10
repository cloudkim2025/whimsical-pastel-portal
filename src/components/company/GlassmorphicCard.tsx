
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
        perspective={1200}
        scale={1.03}
        transitionSpeed={800}
        gyroscope={true}
        glareEnable={true}
        glareMaxOpacity={0.4}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="20px"
        tiltMaxAngleX={20}
        tiltMaxAngleY={20}
        tiltReverse={false}
        tiltAngleXInitial={0}
        tiltAngleYInitial={0}
        className="tilt-container w-full h-full"
      >
        <div
          className={cn(
            "relative rounded-3xl overflow-hidden w-full h-full glassmorphic-card", 
            getBackgroundStyle(),
            className
          )}
        >
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
