
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
  
  // Handle scroll events for parallax and 3D effects
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleStartFree = () => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-ghibli-midnight/90 via-ghibli-forest/50 to-background/90">
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
      
      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Company Header Section */}
          <CompanyHeader />
          
          {/* Vision Section */}
          <VisionSection />
          
          {/* Feature Section */}
          <FeatureSection />
          
          {/* Philosophy Section */}
          <PhilosophySection />
          
          {/* Testimonials Section */}
          <TestimonialsSection />
          
          {/* Call to Action Section */}
          <CTASection onStartFree={handleStartFree} />
          
          {/* Scroll indicator */}
          <motion.div
            className="flex justify-center my-12"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
              <Cloud className="h-6 w-6 text-white" />
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompanyInfo;
