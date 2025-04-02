
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
  lectureId: string;
  amount: number;
  paymentMethod: string;
}
