import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CancelFailureList from './CancelFailureList';
import VerificationFailureList from './VerificationFailureList';
import { Link, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import RefundFailureList from './RefundFailureList';

const FailureManagementPage = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const activeTab = ['refund', 'cancel', 'verify'].includes(currentPath) ? currentPath : 'refund';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold korean-text">결제 실패 관리</h2>

      <Tabs value={activeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="refund" asChild>
            <Link to="refund" className="korean-text">보상 환불 실패</Link>
          </TabsTrigger>
          <TabsTrigger value="cancel" asChild>
            <Link to="cancel" className="korean-text">결제 취소 실패</Link>
          </TabsTrigger>
          <TabsTrigger value="verify" asChild>
            <Link to="verify" className="korean-text">검증 실패</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Routes>
        <Route path="" element={<Navigate to="refund" replace />} />
        <Route path="refund" element={<RefundFailureList />} />
        <Route path="cancel" element={<CancelFailureList />} />
        <Route path="verify" element={<VerificationFailureList />} />
        <Route path="*" element={<RefundFailureList />} />
      </Routes>
    </div>
  );
};

// ✅ 올바른 export 대상
export default FailureManagementPage;
