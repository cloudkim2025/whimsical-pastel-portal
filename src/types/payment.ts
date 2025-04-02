
export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

export interface PaymentItem {
  id: string;
  courseId: string;
  courseName: string;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
}

export interface PaymentRequest {
  courseId: string;
  amount: number;
  paymentMethod: string;
}
