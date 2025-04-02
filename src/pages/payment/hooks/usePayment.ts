
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { paymentAPI } from '@/api/payment';
import { PaymentRequest } from '@/types/payment';

interface UsePaymentProps {
  courseId: string;
}

interface CourseData {
  id: string;
  title: string;
  price: string;
  [key: string]: any;
}

declare global {
  interface Window {
    IMP: any;
  }
}

export const usePayment = ({ courseId }: UsePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const processKakaoPayment = (course: CourseData) => {
    if (!window.IMP) {
      toast.error('결제 모듈을 불러오는데 실패했습니다. 페이지를 새로고침해 주세요.');
      setIsProcessing(false);
      return;
    }

    // 결제 금액 숫자로 변환 (,를 제거하고 정수로 변환)
    const amount = parseInt(course.price.replace(/,/g, ''), 10);
    
    // 포트원 api 초기화
    window.IMP.init("imp18800044");
    
    // 포트원 api 결제창 호출
    window.IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME", // 결제 방식
        pay_method: "card",
        merchant_uid: `kakao-${crypto.randomUUID()}`, // 주문 고유 번호
        name: course.title, // 강의 제목을 상품 이름으로
        amount: amount, // 강의 금액
        buyer_email: user?.email || "guest@example.com", // 구매자 정보
        buyer_name: user?.nickname || "게스트",
      },
      function (response: any) {
        // 성공했을 때 로직
        if (response.success) {
          const paymentData: PaymentRequest = {
            courseId: course.id,
            amount: response.paid_amount,
            paymentMethod: response.pg_provider
          };
          
          paymentAPI.savePayment(paymentData)
            .then(() => {
              toast.success('결제가 완료되었습니다!');
              navigate('/payment-history');
            })
            .catch(error => {
              console.error('결제 정보 저장 실패', error);
              toast.error('결제 정보 저장에 실패했습니다. 고객센터에 문의해 주세요.');
            })
            .finally(() => {
              setIsProcessing(false);
            });
        } else {
          toast.error(response.error_msg || '결제에 실패했습니다.');
          setIsProcessing(false);
        }
      }
    );
  };

  const simulatePayment = () => {
    // 다른 결제 방식에 대한 처리를 시뮬레이션
    setTimeout(() => {
      toast.success('결제가 완료되었습니다!');
      navigate('/payment-history');
      setIsProcessing(false);
    }, 1500);
  };

  return {
    isProcessing,
    setIsProcessing,
    processKakaoPayment,
    simulatePayment
  };
};
