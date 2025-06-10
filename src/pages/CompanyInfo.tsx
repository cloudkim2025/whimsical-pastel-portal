
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Cloud, MousePointerClick } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
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

  // React Spring animations for background elements
  const floatAnimation1 = useSpring({
    from: { transform: 'translateY(0px) scale(1)' },
    to: { transform: 'translateY(-20px) scale(1.05)' },
    config: { duration: 20000 },
    loop: { reverse: true }
  });

  const floatAnimation2 = useSpring({
    from: { transform: 'translateY(-10px) scale(1.02)' },
    to: { transform: 'translateY(10px) scale(0.98)' },
    config: { duration: 15000 },
    loop: { reverse: true }
  });

  const floatAnimation3 = useSpring({
    from: { transform: 'translateY(5px) scale(1.01)' },
    to: { transform: 'translateY(-15px) scale(1.04)' },
    config: { duration: 25000 },
    loop: { reverse: true }
  });

  const floatAnimation4 = useSpring({
    from: { transform: 'translateY(-5px) scale(0.99)' },
    to: { transform: 'translateY(15px) scale(1.03)' },
    config: { duration: 18000 },
    loop: { reverse: true }
  });

  const floatAnimation5 = useSpring({
    from: { transform: 'translateY(10px) scale(1.01)' },
    to: { transform: 'translateY(-10px) scale(0.97)' },
    config: { duration: 22000 },
    loop: { reverse: true }
  });
  
  const handleStartFree = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden company-info-background">
      {/* Enhanced 3D Background with React Spring animations */}
      <div className="fixed inset-0 z-0">
        {/* Animated background blur elements */}
        <animated.div style={floatAnimation1} className="blur-element blur-element-1"></animated.div>
        <animated.div style={floatAnimation2} className="blur-element blur-element-2"></animated.div>
        <animated.div style={floatAnimation3} className="blur-element blur-element-3"></animated.div>
        <animated.div style={floatAnimation4} className="blur-element blur-element-4"></animated.div>
        <animated.div style={floatAnimation5} className="blur-element blur-element-5"></animated.div>
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
