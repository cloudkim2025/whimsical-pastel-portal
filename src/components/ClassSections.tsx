
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Star, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock lectures data with the provided instructor images
const createMockLectures = (prefix: string) => Array(6).fill(null).map((_, idx) => {
  // Use the uploaded images
  const uploadedImages = [
    'public/lovable-uploads/54a601ec-8297-4281-9f86-96314a37d694.png', // AI로 보는 세상
    'public/lovable-uploads/872cdf2e-5e57-4437-9d56-e3d9de32f64e.png', // OAuth2 로그인
    'public/lovable-uploads/f3deb0c3-69a6-4303-938a-b75ec8a7156a.png', // AWS 클라우드
    'public/lovable-uploads/5058af0f-6ce4-43e0-999f-79c23b02bfe6.png', // iOS 앱 개발
    'public/lovable-uploads/377ae563-df7f-443f-94fd-8ff42f1b5220.png', // REST API
    'public/lovable-uploads/dbeefc26-dadd-4789-9a11-87c800bc1f06.png', // REST API
    'public/lovable-uploads/9b530af4-f3e8-4917-a3ea-b2572b23abfd.png', // Vue 3
    'public/lovable-uploads/0091da42-215f-49f1-aec1-327c8338951c.png'  // 스프링 부트
  ];
  
  // Titles based on category
  const titles = {
    updated: [
      'AI로 보는 세상: 딥러닝 기초부터 실전까지',
      'OAuth2 로그인 시스템 구현',
      'AWS로 시작하는 클라우드 인프라',
      'iOS 앱 개발 입문',
      'REST API 설계와 보안',
      'Vue 3 완전 입문'
    ],
    popular: [
      'REST API 설계와 보안',
      'OAuth2 로그인 시스템 구현',
      'AI로 보는 세상: 딥러닝과 머신러닝',
      '스프링 부트로 시작하는 백엔드 개발',
      'Vue 3 완전 입문',
      'iOS 앱 개발 입문'
    ],
    deadline: [
      '마감 임박: AI로 보는 세상',
      '마감 임박: OAuth2 로그인 구현',
      '마감 임박: AWS 클라우드 인프라',
      '마감 임박: iOS 앱 개발 특강',
      '마감 임박: REST API 설계',
      '마감 임박: Vue 3 입문'
    ]
  };

  const instructors = {
    updated: ['김최신 교수', '박업데이트 강사', '이신기술 개발자', '최프론트 선임', '정백엔드 아키텍트', '강풀스택 개발자'],
    popular: ['김인기 강사', '이데이터 박사', '박AI 연구원', '최프론트 개발자', '정백엔드 전문가', '윤클라우드 아키텍트'],
    deadline: ['부트캠프 코치팀', '실무 프로젝트 팀', '모바일 개발팀', '데이터 랩 교수진', '클라우드 엔지니어팀', '파이썬 전문 강사']
  };
  
  // Updated videos with working sources
  const videos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  ];
  
  // Get image index - ensure we don't go beyond available images
  const imageIndex = idx % uploadedImages.length;
  
  return {
    id: `${prefix}-${idx + 1}`,
    title: titles[prefix as keyof typeof titles][idx],
    instructor: instructors[prefix as keyof typeof instructors][idx],
    image: uploadedImages[imageIndex],
    rating: (4 + Math.random()).toFixed(1),
    price: (49000 + idx * 5000).toLocaleString(),
    bookmarks: Math.floor(Math.random() * 100),
    deadline: prefix === 'deadline' ? `${Math.floor(Math.random() * 7) + 1}일 남음` : undefined,
    updateDate: prefix === 'updated' ? `${Math.floor(Math.random() * 7) + 1}일 전` : undefined,
    viewCount: prefix === 'popular' ? `${Math.floor(Math.random() * 1000) + 100}회` : undefined,
    videoUrl: videos[idx % videos.length], // Add videos to all categories for better demonstration
  };
});

const updatedLectures = createMockLectures('updated');
const popularLectures = createMockLectures('popular');
const deadlineLectures = createMockLectures('deadline');

const ClassSections: React.FC = () => {
  const updatedCarouselRef = useRef<HTMLDivElement>(null);
  const popularCarouselRef = useRef<HTMLDivElement>(null);
  const deadlineCarouselRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  
  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      
      ref.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };
  
  const handleMouseEnter = (lectureId: string) => {
    setActiveVideo(lectureId);
    const video = videoRefs.current[lectureId];
    if (video) {
      video.currentTime = 0;
      video.muted = true;
      video.play().catch(err => console.error("Video play failed:", err));
    }
  };
  
  const handleMouseLeave = (lectureId: string) => {
    setActiveVideo(null);
    const video = videoRefs.current[lectureId];
    if (video) {
      video.pause();
    }
  };
  
  const renderLecturesList = (lectures: typeof updatedLectures, ref: React.RefObject<HTMLDivElement>) => (
    <div className="relative group">
      <div 
        ref={ref}
        className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {lectures.map((lecture, idx) => (
          <motion.div
            key={lecture.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="min-w-[280px] max-w-[280px] snap-start"
            onMouseEnter={() => lecture.videoUrl && handleMouseEnter(lecture.id)}
            onMouseLeave={() => lecture.videoUrl && handleMouseLeave(lecture.id)}
          >
            <div className="bg-white rounded-lg overflow-hidden border border-ghibli-meadow/20 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
              <div className="relative">
                <img 
                  src={lecture.image} 
                  alt={lecture.title} 
                  className={`w-full h-40 object-cover ${activeVideo === lecture.id ? 'opacity-0' : 'opacity-100'}`}
                />
                
                {lecture.videoUrl && (
                  <video
                    ref={el => videoRefs.current[lecture.id] = el}
                    src={lecture.videoUrl}
                    className={`absolute inset-0 w-full h-40 object-cover ${activeVideo === lecture.id ? 'opacity-100' : 'opacity-0'}`}
                    muted
                    playsInline
                    loop
                  />
                )}
                
                <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10">
                  <Heart className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
                
                {lecture.videoUrl && (
                  <div className={`absolute inset-0 flex items-center justify-center ${activeVideo === lecture.id ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="bg-black/40 rounded-full p-2">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
                
                {lecture.deadline && (
                  <div className="absolute bottom-0 left-0 bg-red-500 text-white px-3 py-1 text-xs font-medium flex items-center z-10">
                    <Clock className="h-3 w-3 mr-1" /> {lecture.deadline}
                  </div>
                )}
                {lecture.updateDate && (
                  <div className="absolute bottom-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-medium z-10">
                    {lecture.updateDate} 업데이트
                  </div>
                )}
                {lecture.viewCount && (
                  <div className="absolute bottom-0 left-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium z-10">
                    조회수 {lecture.viewCount}
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <Link to={`/lecture/${lecture.id}`}>
                  <h3 className="font-medium text-ghibli-midnight hover:text-ghibli-forest transition-colors mb-1 line-clamp-2 min-h-[48px]">
                    {lecture.title}
                  </h3>
                </Link>
                <p className="text-sm text-ghibli-stone mb-2">
                  {lecture.instructor}
                </p>
                <div className="flex items-center space-x-1 mb-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{lecture.rating}</span>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-bold text-ghibli-midnight">₩{lecture.price}</span>
                  <span className="text-xs text-ghibli-stone flex items-center">
                    <Heart className="h-3 w-3 mr-1" /> {lecture.bookmarks}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:flex rounded-full bg-white shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => scroll(ref, 'left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden md:flex rounded-full bg-white shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => scroll(ref, 'right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
  
  return (
    <div className="py-12">
      <h2 className="text-2xl md:text-3xl font-handwritten text-center text-ghibli-forest mb-8">
        다양한 강의 살펴보기
      </h2>
      
      <Tabs defaultValue="updated" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md mx-auto">
          <TabsTrigger value="updated" className="text-sm">최근 업데이트</TabsTrigger>
          <TabsTrigger value="popular" className="text-sm">인기 강의</TabsTrigger>
          <TabsTrigger value="deadline" className="text-sm">마감 임박</TabsTrigger>
        </TabsList>
        
        <TabsContent value="updated" className="mt-0">
          {renderLecturesList(updatedLectures, updatedCarouselRef)}
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          {renderLecturesList(popularLectures, popularCarouselRef)}
        </TabsContent>
        
        <TabsContent value="deadline" className="mt-0">
          {renderLecturesList(deadlineLectures, deadlineCarouselRef)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassSections;
