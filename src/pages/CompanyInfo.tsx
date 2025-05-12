
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Cloud, RotateCw, Sparkles, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Import our components
import InteractiveBackground from '@/components/company/InteractiveBackground';
import CompanyHeader from '@/components/company/CompanyHeader';
import FeatureSection from '@/components/company/FeatureSection';
import VisionSection from '@/components/company/VisionSection';
import PhilosophySection from '@/components/company/PhilosophySection';
import CTASection from '@/components/company/CTASection';
import TestimonialsSection from '@/components/company/TestimonialsSection';

const CompanyInfo: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Handle scroll events for parallax and 3D effects
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };
  
  // Handle mouse movement for interactive effects
  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    });
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const handleStartFree = () => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  
  // Calculate transform style based on scroll and mouse position
  const getParallaxStyle = (depth: number = 1) => ({
    transform: `translateZ(${depth * -10}px) translateX(${mousePos.x * depth * 10}px) translateY(${mousePos.y * depth * 10}px)`
  });
  
  return (
    <div className="min-h-screen relative overflow-x-hidden perspective-1000">
      {/* Interactive 3D background */}
      <InteractiveBackground scrollY={scrollY} />
      
      {/* Main content */}
      <Header />
      
      {/* Scroll instructions */}
      <motion.div 
        className="fixed bottom-8 right-8 z-30 bg-black/50 backdrop-blur-md p-3 rounded-full flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <MousePointerClick className="h-5 w-5 text-white" />
        <span className="text-white text-sm font-medium">스크롤하여 탐색하세요</span>
      </motion.div>
      
      {/* 3D Container for all content */}
      <div 
        className="transform-gpu perspective-1000 w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto transform-gpu">
            {/* Company Header Section */}
            <motion.div 
              style={{ ...getParallaxStyle(0.2) }}
              className="mb-16"
            >
              <CompanyHeader />
            </motion.div>
            
            {/* Vision Section */}
            <motion.div 
              style={{ ...getParallaxStyle(0.4) }}
              className="my-24"
            >
              <VisionSection />
            </motion.div>
            
            {/* Feature Section */}
            <motion.div 
              style={{ ...getParallaxStyle(0.6) }}
              className="my-24"
            >
              <FeatureSection />
            </motion.div>
            
            {/* Philosophy Section */}
            <motion.div 
              style={{ ...getParallaxStyle(0.5) }}
              className="my-24"
            >
              <PhilosophySection />
            </motion.div>
            
            {/* Testimonials Section */}
            <motion.div 
              style={{ ...getParallaxStyle(0.3) }}
              className="my-24"
            >
              <TestimonialsSection />
            </motion.div>
            
            {/* Call to Action Section */}
            <motion.div 
              style={{ ...getParallaxStyle(0.2) }}
              className="my-24"
            >
              <CTASection onStartFree={handleStartFree} />
            </motion.div>
            
            {/* Floating particles */}
            <div className="h-24 relative">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-white/10 rounded-full backdrop-blur-sm"
                  animate={{
                    x: [0, Math.random() * 100 - 50, 0],
                    y: [0, Math.random() * 100 - 50, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5 + i,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + i * 15}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default CompanyInfo;
