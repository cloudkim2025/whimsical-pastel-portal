import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/api/auth';
import { tokenManager } from '@/utils/tokenManager';
import LectureForm from '@/components/lectures/LectureForm';
import AccessDenied from '@/components/lectures/AccessDenied';

const LectureUpload: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null); // null = 로딩 중
  const [nickname, setNickname] = useState('');
  const userInfo = tokenManager.getUserInfo();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await authAPI.getInstructorRole();
        const isApproved = res.data?.success;

        if (userInfo?.nickname) {
          setNickname(userInfo.nickname);
        }

        if (isApproved) {
          setHasAccess(true);
        } else {
          toast({
            variant: 'destructive',
            title: res.data?.message,
            description: '강사 승인 후 강의를 등록할 수 있습니다.',
          });
          setHasAccess(false);
          navigate('/');
        }
      } catch (error) {
        console.error('역할 확인 실패:', error);
        toast({
          variant: 'destructive',
          title: '에러 발생',
          description: '권한 확인 중 오류가 발생했습니다.',
        });
        setHasAccess(false);
        navigate('/');
      }
    };

    fetchUserRole();
  }, [navigate, toast, userInfo?.nickname]);

  return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-6" lang="ko">강의 등록</h1>
              {nickname && (
                  <p className="text-ghibli-stone mb-8 korean-text">
                    {nickname} 강사님, 새로운 강의를 등록해주세요.<br />
                    업로드된 강의는 AI 분석을 거쳐 커리큘럼이 생성되며, 검토 후 플랫폼에 게시됩니다.
                  </p>
              )}

              {hasAccess ? <LectureForm /> : <AccessDenied />}
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default LectureUpload;
