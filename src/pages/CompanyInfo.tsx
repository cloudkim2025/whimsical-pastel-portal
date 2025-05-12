
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Import our new components
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
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-background/80 via-background/90 to-background">
      {/* Interactive 3D background */}
      <InteractiveBackground scrollY={scrollY} />
      
      {/* Main content */}
      <Header />
      
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompanyInfo;
