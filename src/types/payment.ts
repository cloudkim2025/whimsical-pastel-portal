
export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

export interface PaymentItem {
  id: string;
  lectureId: string;
  lectureName: string;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
}

export interface PaymentRequest {
  productId: number;
  merchantUid: string;
  impUid: string;
  productPrice: number;
  paidAmount: number;
  paymentMethod: string;
}
