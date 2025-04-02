
import API from '@/utils/apiClient';

export const paymentAPI = {
  // 결제 요청
  savePayment: (paymentData: any) => {
    return API.post('/pay/save', paymentData);
  },
  
  // 결제 내역 조회
  getPaymentHistory: () => {
    return API.get('/pay');
  }
};
