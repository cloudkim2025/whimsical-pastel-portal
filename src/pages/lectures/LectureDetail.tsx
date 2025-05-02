// ✅ 주요 리팩토링 포인트:
// - useAuth 제거 → 대신 서버에서 role + status 체크
// - 강의 구매 여부 API로 체크할 수 있도록 mock 제거 예정
// - isApprovedInstructor 여부로 시청 가능 여부 제어

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Heart, Share2, Clock, Users, Award, Bot, Play, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import VideoLectureModal from '@/components/VideoLectureModal';
import { Textarea } from '@/components/ui/textarea';
import CurriculumPreview from '@/components/lectures/CurriculumPreview';
import { authAPI } from '@/api/auth';
import { tokenManager } from '@/utils/tokenManager';

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
  description: `이 강의는 ${id.includes('ai') ? 'AI 기술' : '웹 개발'}의 기초부터 고급 기술까지 모든 것을 다루는 종합적인 과정입니다.`,
  curriculum: [
    '강의 소개 및 개발 환경 설정',
    '웹 개발의 기본 원리와 HTML/CSS 기초',
    'JavaScript 기초 문법과 DOM 조작',
    'React의 개념과 컴포넌트 기반 아키텍처'
  ],
  lectureContent: [
    { title: '섹션 1: 기초 개념', lectures: ['1. 소개', '2. 환경설정'] },
    { title: '섹션 2: 응용 기술', lectures: ['3. 실습', '4. 프로젝트'] }
  ],
  reviews: [
    { name: '김학생', rating: 5, comment: '좋은 강의!' },
    { name: '홍길동', rating: 4, comment: '많이 배웠어요.' }
  ]
});

const LectureDetail: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lecture, setLecture] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('intro');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [nickname, setNickname] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (lectureId) {
      setLecture(getLectureData(lectureId));
    }
  }, [lectureId]);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await authAPI.getInstructorRole();
        setIsApproved(res.data.success);

        const userInfo = tokenManager.getUserInfo();
        if (userInfo?.nickname) setNickname(userInfo.nickname);
      } catch (err) {
        setIsApproved(false);
      }
    };
    checkRole();
  }, []);

  const handleWatchLecture = () => {
    if (!isApproved) {
      toast.error('강의 시청은 승인된 강사만 가능합니다.');
      return;
    }
    setShowVideoModal(true);
  };

  const handleSubmitReview = () => {
    if (!isApproved) {
      toast.error('수강평 작성은 승인된 강사만 가능합니다.');
      return;
    }
    if (!lecture?.isPurchased) {
      toast.error('강의를 구매해야 수강평을 작성할 수 있습니다.');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }
    const newReview = { name: nickname || '익명', rating: reviewRating, comment: reviewComment };
    setLecture((prev: any) => ({ ...prev, reviews: [newReview, ...prev.reviews] }));
    setReviewComment('');
    toast.success('수강평 등록 완료');
  };

  if (!lecture) return <div>강의 정보를 불러오는 중...</div>;

  return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 container mx-auto">
          <h1 className="text-3xl font-bold mb-4">{lecture.title}</h1>
          <div className="mb-6">{lecture.description}</div>

          <Button onClick={handleWatchLecture} disabled={!isApproved}>강의 보기</Button>

          {isApproved && lecture.isPurchased && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">수강평 작성</h2>
                <Textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="내용 입력" />
                <Button onClick={handleSubmitReview} className="mt-2">제출</Button>
              </div>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-2">수강평</h2>
            {lecture.reviews.map((review: any, idx: number) => (
                <div key={idx} className="border p-2 mb-2">
                  <div className="font-bold">{review.name}</div>
                  <div>{review.comment}</div>
                </div>
            ))}
          </div>
        </main>
        <Footer />

        <VideoLectureModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} course={lecture} />
      </div>
  );
};

export default LectureDetail;
