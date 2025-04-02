
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { paymentAPI } from '@/api/payment';

interface UsePaymentProps {
  lectureId: string;
}

export const usePayment = ({ lectureId }: UsePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const processKakaoPayment = async (lecture: any) => {
    // (실제로는 여기서 포트원 SDK를 사용하여 결제 진행)
    console.log('카카오페이 결제 시작:', { lecture });
    
    try {
      // 결제 프로세스 시뮬레이션 (실제로는 포트원 SDK 사용)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 결제 성공 시 백엔드로 결제 정보 저장
      await paymentAPI.savePayment({
        lectureId,
        paymentMethod: 'KAKAO_PAY',
        amount: parseInt(lecture.price.replace(/,/g, '')),
      });
      
      toast.success('결제가 완료되었습니다!');
      navigate('/payment/success', { 
        state: { lectureId, lectureName: lecture.title } 
      });
    } catch (error) {
      console.error('결제 처리 중 오류 발생:', error);
      toast.error('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const simulatePayment = async () => {
    try {
      // 테스트용 결제 프로세스 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('결제가 완료되었습니다!');
      navigate('/payment/history');
    } catch (error) {
      toast.error('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    setIsProcessing,
    processKakaoPayment,
    simulatePayment
  };
};
