
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Cloud, MousePointerClick } from 'lucide-react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import our components
import CompanyHeader from '@/components/company/CompanyHeader';
import FeatureSection from '@/components/company/FeatureSection';
import VisionSection from '@/components/company/VisionSection';
import PhilosophySection from '@/components/company/PhilosophySection';
import CTASection from '@/components/company/CTASection';
import TestimonialsSection from '@/components/company/TestimonialsSection';

const CompanyInfo: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scrollY, setScrollY] = useState(0);
  
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 100
    });
  }, []);
  
  // Handle scroll events for parallax and 3D effects
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleStartFree = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden company-info-background">
      {/* Enhanced 3D Background with motion.div animations */}
      <div className="fixed inset-0 z-0">
        {/* Animated background blur elements */}
        <motion.div 
          className="blur-element blur-element-1"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="blur-element blur-element-2"
          animate={{
            y: [-10, 10, -10],
            scale: [1.02, 0.98, 1.02]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="blur-element blur-element-3"
          animate={{
            y: [5, -15, 5],
            scale: [1.01, 1.04, 1.01]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="blur-element blur-element-4"
          animate={{
            y: [-5, 15, -5],
            scale: [0.99, 1.03, 0.99]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="blur-element blur-element-5"
          animate={{
            y: [10, -10, 10],
            scale: [1.01, 0.97, 1.01]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
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
    </div>
  );
};

export default CompanyInfo;
