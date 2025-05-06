
import API from '@/utils/apiClient';
import { PaymentRequest } from '@/types/payment';

export const paymentAPI = {
  // 결제 요청 (포트원에서 응답받은 결제 정보를 백엔드로 전송)
  savePayment: (paymentData: PaymentRequest, userId: number) => {
    return API.post('/pay/save', paymentData, {
      headers: {
        'X-User-id': userId
      }
    });
  },

  // 결제 내역 조회 (본인 것만)
  getMyPurchases: () => {
    return API.get('/pay/my-purchases', {
      headers: {
        'X-User-id': Number(localStorage.getItem('userId')) // 또는 tokenManager 등에서 추출
      }
    });
  },

  cancelPayment: (merchantUid: string) => {
    return API.post('/pay/cancel', { merchantUid }, {
      headers: {
        'X-User-id': Number(localStorage.getItem('userId'))
      }
    });
  }
};
