import React, { useEffect, useState } from 'react';
import { rollbackAPI } from '@/api/rollback';
import { toast } from 'sonner';

interface RefundFailure {
  id: number;
  merchantUid: string;
  reason: string;
}

const RefundFailureList = () => {
  const [failures, setFailures] = useState<RefundFailure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    rollbackAPI.getRefundFailures(0, 10)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setFailures(data);
        } else {
          throw new Error('올바르지 않은 응답 형식');
        }
      })
      .catch((err) => {
        console.error('🚨 환불 실패 목록 에러:', err);
        setError('환불 실패 목록을 불러올 수 없습니다.');
        toast.error('환불 실패 목록 불러오기 실패');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8 korean-text">불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8 korean-text">{error}</div>;
  }

  if (failures.length === 0) {
    return <div className="text-center text-muted-foreground py-8 korean-text">환불 실패 내역이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {failures.map((item) => (
        <div key={item.id} className="p-4 border rounded-md">
          <strong>{item.merchantUid}</strong>
          <p className="text-sm text-muted-foreground">{item.reason}</p>
        </div>
      ))}
    </div>
  );
};

export default RefundFailureList;
