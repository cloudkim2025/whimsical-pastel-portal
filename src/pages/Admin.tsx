
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InstructorManagement from '@/components/admin/InstructorManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import { useAuth } from '@/contexts/AuthContext';

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-ghibli-midnight mb-4 korean-text">
              접근 권한이 없습니다
            </h2>
            <p className="text-ghibli-stone mb-6 korean-text">
              관리자 계정으로 로그인해야 이 페이지에 접근할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-secondary korean-text">
                홈으로 돌아가기
              </Link>
              <Link to="/login" className="btn-primary korean-text">
                관리자 로그인하기
              </Link>
            </div>
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
          <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-8" lang="ko">관리자 페이지</h1>
          
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
