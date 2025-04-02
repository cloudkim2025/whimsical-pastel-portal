
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import OrderSummary from './components/OrderSummary';
import PaymentMethods from './components/PaymentMethods';
import CheckoutSummary from './components/CheckoutSummary';
import { usePayment } from './hooks/usePayment';

// Portone SDK를 위한 스크립트 로딩 함수
const loadPortoneScript = () => {
  const script = document.createElement('script');
  script.src = 'https://cdn.iamport.kr/v1/iamport.js';
  script.async = true;
  document.body.appendChild(script);
  
  return () => {
    if (document.body.contains(script)) {
      document.body.removeChild(script);
    }
  };
};

// Mock lecture data (실제 앱에서는 API에서 데이터 가져옴)
const getLectureData = (id: string) => ({
  id,
  title: `웹 개발의 모든 것 ${id.includes('ai') ? '- AI 강의' : ''}`,
  instructor: id.includes('ai') ? `AI 튜터 ${id.slice(-1)}` : `김강사 ${id.slice(-1)}`,
  image: `https://api.dicebear.com/7.x/shapes/svg?seed=${id}`,
  category: id.includes('ai') ? 'AI 기초' : '프론트엔드',
  price: (id.includes('ai') ? 22000 : 15000).toLocaleString(),
  duration: `${Math.floor(Math.random() * 20) + 10}시간`,
});

const Checkout: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lecture, setLecture] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('kakao');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isProcessing, setIsProcessing, processKakaoPayment, simulatePayment } = usePayment({
    lectureId: lectureId || ''
  });
  
  useEffect(() => {
    // Portone SDK 로드
    const cleanup = loadPortoneScript();

    // 인증 확인
    if (!isAuthenticated) {
      toast.error('결제를 진행하려면 로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    if (lectureId) {
      // 실제 앱에서는 API에서 강의 데이터를 가져옴
      setLecture(getLectureData(lectureId));
    }

    return cleanup;
  }, [lectureId, isAuthenticated, navigate]);
  
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast.error('이용약관에 동의해주세요.');
      return;
    }

    if (!lecture) {
      toast.error('강의 정보를 불러오는 데 실패했습니다.');
      return;
    }
    
    setIsProcessing(true);
    
    if (paymentMethod === 'kakao') {
      processKakaoPayment(lecture);
    } else {
      // 다른 결제 방식에 대한 처리
      simulatePayment();
    }
  };
  
  if (!lecture) {
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
        <h1 className="text-3xl font-handwritten text-center text-ghibli-forest mb-8">
          결제하기
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 왼쪽: 주문 요약 */}
          <div className="lg:col-span-4">
            <OrderSummary lecture={lecture} />
          </div>
          
          {/* 가운데: 결제 수단 */}
          <div className="lg:col-span-4">
            <PaymentMethods 
              paymentMethod={paymentMethod} 
              setPaymentMethod={setPaymentMethod} 
            />
          </div>
          
          {/* 오른쪽: 최종 결제 */}
          <div className="lg:col-span-4">
            <CheckoutSummary 
              price={lecture.price}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              isProcessing={isProcessing}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
