import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Cloud } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import VisionCard from '@/components/company/VisionCard';
import FeatureCards from '@/components/company/FeatureCards';
import PhilosophyCard from '@/components/company/PhilosophyCard';
import TestimonialsSection from '@/components/company/TestimonialsSection';

const CompanyInfo: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartFree = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto pt-32 px-4 pb-16">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Cloud className="h-16 w-16 text-ghibli-meadow mx-auto mb-4 animate-float" />
              <h1 className="text-4xl font-handwritten text-ghibli-forest mb-4">Aigongbu</h1>
              <p className="text-xl text-ghibli-stone italic">
                "인터넷 강의 및 AI와 함께 공부"
              </p>
            </div>

            {/* Vision Card */}
            <VisionCard />

            {/* Features Cards */}
            <FeatureCards />

            {/* Educational Philosophy */}
            <PhilosophyCard />

            {/* Customer Testimonials */}
            <TestimonialsSection />

            {/* Join Us */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center pt-8"
            >
              <h2 className="text-2xl font-handwritten text-ghibli-forest mb-4">함께 성장해요</h2>
              <p className="text-ghibli-midnight mb-6 max-w-2xl mx-auto">
                Aigongbu와 함께 당신의 기술 여정을 시작하세요.
                우리는 당신이 꿈꾸는 미래로 가는 길을 밝혀줄 준비가 되어 있습니다.
              </p>
              <Button
                  onClick={handleStartFree}
                  className="py-2.5 px-5 bg-ghibli-meadow hover:bg-ghibli-forest text-white rounded-full transition-all duration-300"
              >
                무료로 시작하기
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
  );
};

export default CompanyInfo;
