import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        // Mock payment history data for now
        const mockPayments = [
          {
            id: 1,
            lectureTitle: "React 기초 강의",
            amount: 50000,
            status: "completed",
            createdAt: "2024-01-15T10:00:00Z"
          }
        ];
        setPayments(mockPayments);
      } catch (error) {
        console.error('결제 내역 조회 실패:', error);
        toast({
          title: "오류",
          description: "결제 내역을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  return (
    <div>
      <h1>결제 내역</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li key={payment.id}>
              {payment.lectureTitle} - {payment.amount} - {payment.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentHistory;
