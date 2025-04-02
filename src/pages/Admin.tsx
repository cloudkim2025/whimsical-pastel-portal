
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InstructorManagement from '@/components/admin/InstructorManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('instructors');

  useEffect(() => {
    // URL 경로에서 현재 탭 확인
    const path = location.pathname.split('/').pop();
    if (path === 'courses') {
      setActiveTab('courses');
    } else {
      setActiveTab('instructors');
    }
  }, [location]);

  // 관리자 권한 체크
  useEffect(() => {
    if (!isAdmin) {
      toast.error("관리자 권한이 필요합니다.");
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>접근 권한 없음</AlertTitle>
              <AlertDescription>
                관리자 계정으로 로그인해야 이 페이지에 접근할 수 있습니다.
                <div className="mt-4 space-y-2">
                  <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                    홈으로 돌아가기
                  </Button>
                  <Button onClick={() => navigate('/login')} className="w-full">
                    관리자 로그인하기
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-8" lang="ko">
            관리자 페이지 <span className="text-lg font-normal text-ghibli-stone">({user?.nickname})</span>
          </h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 w-full max-w-md mx-auto">
              <TabsTrigger value="instructors" className="flex-1" asChild>
                <Link to="/admin/instructors" className="korean-text w-full">강사 관리</Link>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex-1" asChild>
                <Link to="/admin/courses" className="korean-text w-full">강의 관리</Link>
              </TabsTrigger>
            </TabsList>
            
            <Routes>
              <Route path="/" element={<Navigate to="instructors" replace />} />
              <Route path="instructors" element={<InstructorManagement />} />
              <Route path="courses" element={<CourseManagement />} />
            </Routes>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
