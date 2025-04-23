import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import VideoLectureModal from '@/components/VideoLectureModal';
import {useAuth} from "@/contexts/AuthContext.tsx";

const getLectureData = (id: string) => ({
  id,
  title: `웹 개발의 모든 것 ${id.includes('ai') ? '- AI 강의' : ''}`,
  instructor: id.includes('ai') ? `AI 튜터 ${id.slice(-1)}` : `김강사 ${id.slice(-1)}`,
  image: `https://api.dicebear.com/7.x/shapes/svg?seed=${id}`,
  instructorImage: `https://api.dicebear.com/7.x/avatars/svg?seed=${id}`,
  category: id.includes('ai') ? 'AI 기초' : '프론트엔드',
  rating: (4 + Math.random()).toFixed(1),
  reviewCount: Math.floor(Math.random() * 500) + 50,
  studentCount: Math.floor(Math.random() * 5000) + 500,
  price: (id.includes('ai') ? 22000 : 15000).toLocaleString(),
  bookmarks: Math.floor(Math.random() * 100),
  duration: `${Math.floor(Math.random() * 20) + 10}시간`,
  level: ['입문', '초급', '중급', '고급'][Math.floor(Math.random() * 4)],
  isAI: id.includes('ai'),
  isPurchased: Math.random() > 0.5,
  views: Math.floor(Math.random() * 10000) + 1000,
  description: `이 강의는 ${id.includes('ai') ? 'AI 기술' : '웹 개발'}의 기초부터 고급 기술까지 모든 것을 다루는 종합적인 과정입니다.`
});

const LectureDetail: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lecture, setLecture] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (lectureId) setLecture(getLectureData(lectureId));
  }, [lectureId]);

  const handleCheckout = () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate(`/checkout/${lectureId}`);
  };

  if (!lecture) return <div className="text-center py-32">강의를 불러오는 중...</div>;

  return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto pt-24 px-4 pb-16">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-6 text-ghibli-forest">{lecture.title}</h1>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                      src={lecture.instructorImage}
                      alt="Instructor"
                      className="w-16 h-16 rounded-full border"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{lecture.instructor}</h2>
                    <p className="text-sm text-ghibli-stone">{lecture.category}</p>
                  </div>
                </div>
                <p className="mt-4 text-ghibli-midnight">{lecture.description}</p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              {lecture.isPurchased ? (
                  <Button
                      onClick={() => setShowVideoModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    강의 듣기
                  </Button>
              ) : (
                  <Button
                      onClick={handleCheckout}
                      className="bg-ghibli-meadow hover:bg-ghibli-forest text-white"
                  >
                    결제하기
                  </Button>
              )}
            </div>
          </motion.div>
        </main>

        <VideoLectureModal
            isOpen={showVideoModal}
            onClose={() => setShowVideoModal(false)}
            course={lecture}
        />

        <Footer />
      </div>
  );
};

export default LectureDetail;
