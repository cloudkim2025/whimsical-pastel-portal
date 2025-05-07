// Checkout.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import OrderSummary from './components/OrderSummary';
import PaymentMethods from './components/PaymentMethods';
import CheckoutSummary from './components/CheckoutSummary';
import { usePayment } from './hooks/usePayment';
import { lectureAPI } from '@/api/lecture';

interface CheckoutProps {
  initialLecture?: any;
}

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

const Checkout: React.FC<CheckoutProps> = ({ initialLecture }) => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lecture, setLecture] = useState<any>(initialLecture || null);
  const [paymentMethod, setPaymentMethod] = useState('kakao');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isProcessing, setIsProcessing, processKakaoPayment, simulatePayment } = usePayment({
    lectureId: lectureId || '',
  });

  useEffect(() => {
    const cleanup = loadPortoneScript();

    if (!user) {
      toast.error('결제를 진행하려면 로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // lecture가 없을 경우 API로 다시 불러오기
    if (!initialLecture && lectureId) {
      lectureAPI
          .getLectureDetail(lectureId)
          .then((res) => {
            setLecture(res.data);
          })
          .catch(() => {
            toast.error('강의 정보를 불러오지 못했습니다.');
          });
    }

    return cleanup;
  }, [lectureId, user, navigate, initialLecture]);

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
          <h1 className="text-3xl font-handwritten text-center text-ghibli-forest mb-8">결제하기</h1>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <OrderSummary lecture={lecture} />
            </div>
            <div className="lg:col-span-4">
              <PaymentMethods paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
            </div>
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
