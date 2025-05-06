import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InstructorManagement from '@/components/admin/InstructorManagement';
import LectureManagement from '@/components/admin/LectureManagement';
import FailureManagementPage from '@/components/admin/FailureManagementPage';
import { toast } from 'sonner';
import { authAPI } from '@/api/auth';

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('instructors');
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      // ✅ 탭 상태를 URL 경로로 설정
      if (location.pathname.includes('/admin/lectures')) {
        setActiveTab('lectures');
      } else if (location.pathname.includes('/admin/failures')) {
        setActiveTab('failures');
      } else {
        setActiveTab('instructors');
      }

      // ✅ 관리자 권한 확인
      try {
        const response = await authAPI.getUserRole();
        const role = response.data?.role;

        if (role !== 'ADMIN') {
          toast.error('관리자 권한이 필요합니다.');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('관리자 권한 확인 실패:', error);
        toast.error('관리자 권한 확인 중 오류가 발생했습니다.');
        navigate('/', { replace: true });
      } finally {
        setIsCheckingRole(false);
      }
    };

    initialize();
  }, [location, navigate]);

  if (isCheckingRole) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-8" lang="ko">
            관리자 페이지
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 w-full max-w-md mx-auto">
              <TabsTrigger value="instructors" className="flex-1" asChild>
                <Link to="/admin/instructors" className="korean-text w-full">강사 관리</Link>
              </TabsTrigger>
              <TabsTrigger value="lectures" className="flex-1" asChild>
                <Link to="/admin/lectures" className="korean-text w-full">강의 관리</Link>
              </TabsTrigger>
              <TabsTrigger value="failures" className="flex-1" asChild>
                <Link to="/admin/failures/refund" className="korean-text w-full">결제 실패 관리</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* ✅ 라우팅 경로 설정 */}
          <Routes>
            <Route path="/" element={<Navigate to="instructors" replace />} />
            <Route path="instructors" element={<InstructorManagement />} />
            <Route path="lectures" element={<LectureManagement />} />
            <Route path="failures/*" element={<FailureManagementPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
