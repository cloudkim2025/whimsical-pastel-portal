import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InstructorManagement from '@/components/admin/InstructorManagement';
import LectureManagement from '@/components/admin/LectureManagement';
import { toast } from 'sonner';
import { authAPI } from '@/api/auth';

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('instructors');
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const path = location.pathname.split('/').pop();

    const initialize = async () => {
      // 1. 탭 설정
      if (path === 'lectures') {
        setActiveTab('lectures');
      } else {
        setActiveTab('instructors');
      }

      // 2. API로 관리자 여부 확인
      try {
        const response = await authAPI.getUserRole();
        const role = response.data?.role;

        if (role !== 'ADMIN') {
          toast.error('관리자 권한이 필요합니다.');
          navigate('/', { replace: true }); // 홈으로 리다이렉트
        }
      } catch (error) {
        console.error('관리자 권한 확인 실패:', error);
        toast.error('관리자 권한 확인 중 오류가 발생했습니다.');
        navigate('/', { replace: true });
      } finally {
        setIsCheckingRole(false); // 검증 완료
      }
    };

    initialize();
  }, [location, navigate]);

  if (isCheckingRole) return null; // 권한 확인 중에는 화면 표시 안 함

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
              </TabsList>

              <Routes>
                <Route path="/" element={<Navigate to="instructors" replace />} />
                <Route path="instructors" element={<InstructorManagement />} />
                <Route path="lectures" element={<LectureManagement />} />
              </Routes>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default Admin;
