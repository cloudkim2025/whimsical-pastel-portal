
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Star, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock lectures data with realistic images
const createMockLectures = (prefix: string) => Array(6).fill(null).map((_, idx) => {
  // Select appropriate image based on prefix and index
  const imageBase = 'https://images.unsplash.com/';
  
  // Use different image sets for different categories
  const updatedImages = [
    'photo-1546410531-bb4caa6b424d', 
    'photo-1524178232363-1fb2b075b655', 
    'photo-1544531586-fde5298cdd40', 
    'photo-1551818255-e6e10975bc17', 
    'photo-1588196749597-9ff075ee6b5b', 
    'photo-1531482615713-2afd69097998',
  ];
  
  const popularImages = [
    'photo-1560523159-4a9692d222f9', 
    'photo-1523240795612-9a054b0db644', 
    'photo-1517048676732-d65bc937f952', 
    'photo-1507537297725-24a1c029d3ca',
    'photo-1599658880436-c61792e70672',
    'photo-1536148935331-408321065b18',
  ];
  
  const deadlineImages = [
    'photo-1522071820081-009f0129c71c', 
    'photo-1573496357865-f988a0cb05b9',
    'photo-1626785774573-4b799315345d',
    'photo-1530099486328-e021101a494a',
    'photo-1543269865-cbf427effbad',
    'photo-1543269664-56d93c1b41a6',
  ];
  
  // Titles based on category
  const titles = {
    updated: [
      '최신 React 18 훅 마스터하기',
      'NextJS 13 서버 컴포넌트의 이해',
      'TypeScript 5.0 신규 기능 총정리',
      'Tailwind CSS 3.0 고급 기법',
      'GraphQL API 설계 패턴',
      'Redux Toolkit과 RTK Query 실전'
    ],
    popular: [
      '한 번에 끝내는 자바스크립트 기초',
      'AI 기반 웹 애플리케이션 개발',
      '데이터 시각화 마스터 클래스',
      '백엔드 개발자를 위한 SQL 최적화',
      'AWS 클라우드 아키텍처 설계',
      'DevOps와 CI/CD 파이프라인 구축'
    ],
    deadline: [
      '6월 개강반: 풀스택 부트캠프',
      '이번 주 마감: 프론트엔드 실무 과정',
      '모집 임박: React Native 앱 개발',
      '마지막 기회: 데이터 사이언스 특강',
      '금주 마감: 클라우드 엔지니어링',
      '단 3일 남음: Python 웹 스크래핑'
    ]
  };

  const instructors = {
    updated: ['김최신 교수', '박업데이트 강사', '이신기술 개발자', '최프론트 선임', '정백엔드 아키텍트', '강풀스택 개발자'],
    popular: ['김인기 강사', '이데이터 박사', '박AI 연구원', '최프론트 개발자', '정백엔드 전문가', '윤클라우드 아키텍트'],
    deadline: ['부트캠프 코치팀', '실무 프로젝트 팀', '모바일 개발팀', '데이터 랩 교수진', '클라우드 엔지니어팀', '파이썬 전문 강사']
  };
  
  // Select appropriate images
  let imageIds;
  if (prefix === 'updated') {
    imageIds = updatedImages;
  } else if (prefix === 'popular') {
    imageIds = popularImages;
  } else {
    imageIds = deadlineImages;
  }
  
  // Add videos for popular content
  const videos = [
    'https://static.videezy.com/system/resources/previews/000/042/818/original/business-meeting-02.mp4',
    'https://static.videezy.com/system/resources/previews/000/037/344/original/SA_9.mp4',
    'https://static.videezy.com/system/resources/previews/000/051/520/original/Typing_27.mp4',
    'https://static.videezy.com/system/resources/previews/000/038/886/original/22.mp4',
    'https://static.videezy.com/system/resources/previews/000/043/261/original/young_woman_selfie_04.mp4',
    'https://static.videezy.com/system/resources/previews/000/038/667/original/VQQP5E.mp4'
  ];
  
  return {
    id: `${prefix}-${idx + 1}`,
    title: titles[prefix as keyof typeof titles][idx],
    instructor: instructors[prefix as keyof typeof instructors][idx],
    image: `${imageBase}${imageIds[idx]}?auto=format&fit=crop&w=600&q=80`,
    rating: (4 + Math.random()).toFixed(1),
    price: (49000 + idx * 5000).toLocaleString(),
    bookmarks: Math.floor(Math.random() * 100),
    deadline: prefix === 'deadline' ? `${Math.floor(Math.random() * 7) + 1}일 남음` : undefined,
    updateDate: prefix === 'updated' ? `${Math.floor(Math.random() * 7) + 1}일 전` : undefined,
    viewCount: prefix === 'popular' ? `${Math.floor(Math.random() * 1000) + 100}회` : undefined,
    videoUrl: prefix === 'popular' ? videos[idx] : undefined,
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
