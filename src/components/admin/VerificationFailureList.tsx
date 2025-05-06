import { useEffect, useState } from 'react';
import { rollbackAPI } from '@/api/rollback';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const VerificationFailureList = () => {
  const [failures, setFailures] = useState([]);
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    try {
      const res = await rollbackAPI.getVerificationFailures(page, 10);
      setFailures(res.data);
    } catch (e) {
      toast.error('검증 실패 목록 조회 실패');
    }
  };

  const handleRetryVerification = async (id: number) => {
    try {
      await rollbackAPI.retryVerification(id);
      toast.success('검증 재시도 완료');
      fetchData();
    } catch (e) {
      toast.error('검증 재시도 실패');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th>Purchase ID</th><th>Merchant UID</th><th>사유</th><th>처리</th>
          </tr>
        </thead>
        <tbody>
          {failures.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.merchantUid}</td>
              <td>{f.reason}</td>
              <td><Button onClick={() => handleRetryVerification(f.id)}>검증 재시도</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerificationFailureList;
