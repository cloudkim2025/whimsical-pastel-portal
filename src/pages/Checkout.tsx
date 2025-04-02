
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import CheckoutSummaryCard from '@/components/payment/CheckoutSummaryCard';
import PaymentMethodsCard from '@/components/payment/PaymentMethodsCard';
import CheckoutConfirmationCard from '@/components/payment/CheckoutConfirmationCard';

// Mock course data (same as in CourseDetail)
const getCourseData = (id: string) => ({
  id,
  title: `웹 개발의 모든 것 ${id.includes('ai') ? '- AI 강의' : ''}`,
  instructor: id.includes('ai') ? `AI 튜터 ${id.slice(-1)}` : `김강사 ${id.slice(-1)}`,
  image: `https://api.dicebear.com/7.x/shapes/svg?seed=${id}`,
  category: id.includes('ai') ? 'AI 기초' : '프론트엔드',
  price: (id.includes('ai') ? 22000 : 15000).toLocaleString(),
  duration: `${Math.floor(Math.random() * 20) + 10}시간`,
});

const Checkout: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('kakao');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('결제를 진행하려면 로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    if (courseId) {
      // In a real app, we would fetch course data from an API
      setCourse(getCourseData(courseId));
    }
  }, [courseId, isAuthenticated, navigate]);
  
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast.error('이용약관에 동의해주세요.');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      toast.success('결제가 완료되었습니다!');
      navigate('/profile');
    }, 1500);
  };
  
  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto pt-32 px-4 pb-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghibli-forest mx-auto"></div>
          <p className="mt-4 text-ghibli-forest">정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto pt-24 px-4 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-handwritten text-center text-ghibli-forest mb-8"
        >
          결제하기
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Course summary */}
          <div className="lg:col-span-4">
            <CheckoutSummaryCard course={course} />
          </div>
          
          {/* Middle: Payment methods */}
          <div className="lg:col-span-4">
            <PaymentMethodsCard 
              paymentMethod={paymentMethod} 
              setPaymentMethod={setPaymentMethod} 
            />
          </div>
          
          {/* Right: Checkout summary */}
          <div className="lg:col-span-4">
            <CheckoutConfirmationCard 
              coursePrice={course.price}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              isProcessing={isProcessing}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
