
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { paymentAPI } from '@/api/payment';
import { useAuth } from '@/contexts/AuthContext';

interface UsePaymentProps {
  lectureId: string;
}

export const usePayment = ({ lectureId }: UsePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();


  const processInicisPayment = async (lecture: any) => {
    const IMP = (window as any).IMP;
    const merchantUid = crypto.randomUUID();

    IMP.request_pay(
      {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: merchantUid,
        name: lecture.title,
        amount: parseInt(lecture.price.replace(/,/g, '')),
      },
      async function (rsp: any) {
        if (rsp.success) {
          try {
            await paymentAPI.savePayment({
              productId: Number(lectureId),
              merchantUid: rsp.merchant_uid,
              impUid: rsp.imp_uid,
              productPrice: parseInt(lecture.price.replace(/,/g, '')),
              paidAmount: rsp.paid_amount,
              paymentMethod: 'KG_inicis_'+ rsp.pay_method,
            }, user?.id);

            toast.success('결제가 완료되었습니다!');
          } catch (err) {
            console.error('❌ 결제 저장 실패:', err);
            toast.error('결제는 완료되었지만, 서버 저장 중 오류가 발생했습니다.');
          } finally {
            setIsProcessing(false);
          }
        } else {
          toast.error(`결제 실패: ${rsp.error_msg}`);
          setIsProcessing(false);
        }
      }
    );
  };
  
  return {
    isProcessing,
    setIsProcessing,
  };
};
