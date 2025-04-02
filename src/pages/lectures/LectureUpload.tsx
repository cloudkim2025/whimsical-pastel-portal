
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import LectureForm from '@/components/lectures/LectureForm';
import AccessDenied from '@/components/lectures/AccessDenied';

const LectureUpload: React.FC = () => {
  const { toast } = useToast();
  const { user, isInstructor } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isInstructor) {
      toast({
        variant: "destructive",
        title: "접근 권한 없음",
        description: "강사 계정만 강의를 등록할 수 있습니다."
      });
      navigate('/');
    }
  }, [isInstructor, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-6" lang="ko">강의 등록</h1>
            {user?.nickname && (
              <p className="text-ghibli-stone mb-8 korean-text">
                {user.nickname} 강사님, 새로운 강의를 등록해주세요.
                강의를 업로드하면 AI가 자동으로 영상을 분석하여 커리큘럼을 생성합니다. 
                업로드된 강의는 검토 후 승인되면 플랫폼에 공개됩니다.
              </p>
            )}
            
            {isInstructor ? (
              <LectureForm userId={user?.id} />
            ) : (
              <AccessDenied />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LectureUpload;
