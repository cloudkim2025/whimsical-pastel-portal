import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import LectureForm from '@/components/lectures/LectureForm';
import AccessDenied from '@/components/lectures/AccessDenied';
import { authAPI } from '@/api/auth';

const LectureUpload: React.FC = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isInstructor, setIsInstructor] = useState<boolean | null>(null); // null → 로딩 중 의미

    useEffect(() => {
        const checkInstructorRole = async () => {
            try {
                const res = await authAPI.getInstructorRole();
                if (res.data.success === true) {
                    setIsInstructor(true);
                } else {
                    setIsInstructor(false);
                    toast({
                        variant: 'destructive',
                        title: '접근 권한 없음',
                        description: '강사 계정만 강의를 등록할 수 있습니다.',
                    });
                    navigate('/', { replace: true });
                }
            } catch (err) {
                console.error('강사 권한 확인 실패', err);
                toast({
                    variant: 'destructive',
                    title: '오류 발생',
                    description: '권한 확인 중 오류가 발생했습니다.',
                });
                navigate('/', { replace: true });
            }
        };

        checkInstructorRole();
    }, [navigate, toast]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-6" lang="ko">
                            강의 등록
                        </h1>

                        {user?.nickname && (
                            <p className="text-ghibli-stone mb-8 korean-text">
                                {user.nickname} 강사님, 새로운 강의를 등록해주세요.
                                강의를 업로드하면 AI가 자동으로 영상을 분석하여 커리큘럼을 생성합니다.
                                업로드된 강의는 검토 후 승인되면 플랫폼에 공개됩니다.
                            </p>
                        )}

                        {isInstructor === null && <p className="text-center">강사 권한 확인 중...</p>}

                        {isInstructor && user && (
                            <LectureForm userId={user.userId} />
                        )}

                        {isInstructor === false && <AccessDenied />}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LectureUpload;
