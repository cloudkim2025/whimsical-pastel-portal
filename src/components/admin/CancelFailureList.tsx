import { useEffect, useState } from 'react';
import { rollbackAPI } from '@/api/rollback';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CancelFailureList = () => {
  const [failures, setFailures] = useState([]);
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    try {
      const res = await rollbackAPI.getCancelFailures(page, 10);
      setFailures(res.data);
    } catch (e) {
      toast.error('취소 실패 목록 조회 실패');
    }
  };

  const handleForceCancel = async (purchaseId: number) => {
    try {
      await rollbackAPI.forceCancel(purchaseId);
      toast.success('강제 취소 완료');
      fetchData();
    } catch (e) {
      toast.error('강제 취소 실패');
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
            <tr key={f.purchaseId}>
              <td>{f.purchaseId}</td>
              <td>{f.merchantUid}</td>
              <td>{f.reason}</td>
              <td><Button onClick={() => handleForceCancel(f.purchaseId)}>강제 취소</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CancelFailureList;
