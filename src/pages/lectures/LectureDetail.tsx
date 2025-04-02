
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const LectureDetail: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const { toast } = useToast();
  const [lecture, setLecture] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock loading lecture data
    const fetchLecture = async () => {
      try {
        // In a real app, we would fetch lecture data from an API
        setTimeout(() => {
          setLecture({
            id: lectureId,
            title: `웹 개발의 모든 것 ${lectureId}`,
            instructor: `김강사`,
            description: "이 강의는 웹 개발의 기초부터 고급 기술까지 다룹니다.",
            price: "15000",
            duration: "10시간",
            category: "프론트엔드",
            rating: 4.5,
            reviews: 120
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching lecture:", error);
        toast({
          variant: "destructive",
          title: "강의 정보 로드 실패",
          description: "강의 정보를 불러오는데 실패했습니다."
        });
      }
    };

    fetchLecture();
  }, [lectureId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto pt-32 px-4 pb-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghibli-forest mx-auto"></div>
          <p className="mt-4 text-ghibli-forest">강의 정보를 불러오는 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto pt-32 px-4 pb-16">
        <h1 className="text-3xl font-bold mb-4">{lecture.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Lecture preview */}
            <div className="bg-gray-200 aspect-video rounded-lg mb-6 flex items-center justify-center">
              <p className="text-gray-600">강의 미리보기</p>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">강의 소개</h2>
            <p className="mb-4">{lecture.description}</p>
            
            <h2 className="text-2xl font-bold mb-2">커리큘럼</h2>
            <p>강의 커리큘럼이 이곳에 표시됩니다.</p>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-2">₩{lecture.price}</h2>
              <p className="mb-4">총 {lecture.duration} 강의</p>
              
              <Button className="w-full mb-4">수강 신청하기</Button>
              <Button variant="outline" className="w-full">위시리스트에 추가</Button>
              
              <div className="mt-6">
                <h3 className="font-bold mb-2">이 강의는:</h3>
                <ul className="text-sm space-y-2">
                  <li>✓ 전문가의 꼼꼼한 설명</li>
                  <li>✓ 실습 위주의 학습</li>
                  <li>✓ 수료증 제공</li>
                  <li>✓ 영구 접근 가능</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LectureDetail;
