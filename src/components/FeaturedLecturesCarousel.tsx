
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Updated featured lectures data with the provided images and working videos
const featuredLectures = [
  {
    id: 'featured-1',
    title: 'AI로 보는 세상: 딥러닝 기초부터 실전까지',
    instructor: '김인공 교수',
    image: 'public/lovable-uploads/54a601ec-8297-4281-9f86-96314a37d694.png',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    rating: 4.9,
    price: '129,000',
    description: '딥러닝, 자연어처리, 생성형 AI까지 인공지능의 핵심을 한 번에',
  },
  {
    id: 'featured-2',
    title: 'OAuth2 로그인 시스템 구현',
    instructor: '박웹개발 강사',
    image: 'public/lovable-uploads/872cdf2e-5e57-4437-9d56-e3d9de32f64e.png',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    rating: 4.8,
    price: '149,000',
    description: '구글, 네이버, 카카오로 로그인부터 토큰 발급까지 직접 구현해보세요',
  },
  {
    id: 'featured-3',
    title: 'AWS로 시작하는 클라우드 인프라',
    instructor: '이클라우드 아키텍트',
    image: 'public/lovable-uploads/f3deb0c3-69a6-4303-938a-b75ec8a7156a.png',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    rating: 4.7,
    price: '159,000',
    description: 'EC2, S3, RDS, IAM까지 서비스 배포에 꼭 필요한 구성요소를 배워요',
  },
  {
    id: 'featured-4',
    title: 'iOS 앱 개발 입문',
    instructor: '최모바일 개발자',
    image: 'public/lovable-uploads/5058af0f-6ce4-43e0-999f-79c23b02bfe6.png',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    rating: 4.9,
    price: '179,000',
    description: 'Swift와 SwiftUI를 활용한 실습 중심의 모바일 앱 개발 입문',
  },
  {
    id: 'featured-5',
    title: 'REST API 설계와 보안',
    instructor: '정백엔드 개발자',
    image: 'public/lovable-uploads/377ae563-df7f-443f-94fd-8ff42f1b5220.png',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    rating: 4.6,
    price: '239,000',
    description: '효율적인 API 설계, 인증과 인가, 실전 보안 전략까지 한 번에!',
  },
];

const FeaturedLecturesCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featuredLectures.length);
  }, []);
  
  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? featuredLectures.length - 1 : prev - 1
    );
  };
  
  // Auto play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(nextSlide, 5000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="relative min-h-[400px] md:min-h-[500px] overflow-hidden rounded-xl bg-gradient-to-br from-ghibli-cloud to-ghibli-earth/10 mt-8">
      <div className="absolute inset-0 bg-pattern-dots opacity-10 z-0" />
      
      <AnimatePresence mode="wait">
        {featuredLectures.map((lecture, index) => (
          currentSlide === index && (
            <motion.div
              key={lecture.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex md:flex-row flex-col"
            >
              <div className="md:w-1/2 w-full h-full p-6 md:p-12 flex flex-col justify-center z-10">
                <span className="px-3 py-1 bg-ghibli-forest text-white rounded-full inline-block mb-4 w-fit">인기 강의</span>
                <h2 className="text-2xl md:text-4xl font-bold text-ghibli-midnight mb-4">
                  {lecture.title}
                </h2>
                <p className="text-ghibli-stone mb-6 md:text-lg">
                  {lecture.description}
                </p>
                <div className="flex items-center mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(lecture.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 fill-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-ghibli-stone">
                    {lecture.rating.toFixed(1)}
                  </span>
                  <span className="mx-2 text-ghibli-stone">•</span>
                  <span className="font-bold text-ghibli-midnight">
                    ₩{lecture.price}
                  </span>
                </div>
                <div className="flex gap-4">
                  <Link
                    to={`/lecture/${lecture.id}`}
                    className="px-6 py-3 bg-ghibli-meadow hover:bg-ghibli-forest text-white rounded-full transition-colors"
                  >
                    강의 보기
                  </Link>
                  <Link
                    to={`/lecture/${lecture.id}`}
                    className="px-6 py-3 border border-ghibli-meadow text-ghibli-forest hover:bg-ghibli-cloud rounded-full transition-colors"
                  >
                    더 알아보기
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 w-full h-64 md:h-full relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={lecture.image}
                    alt={lecture.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  
                  {/* Overlay text on the image */}
                  <div className="absolute bottom-8 right-8 max-w-xs bg-black/50 backdrop-blur-sm p-3 rounded-lg text-white">
                    <h3 className="text-lg font-bold mb-1">
                      {lecture.title.split(':')[0]}
                    </h3>
                    <p className="text-sm">
                      {lecture.instructor} 강의
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-6 flex items-center space-x-4 z-20">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/70 backdrop-blur-sm border-ghibli-meadow hover:bg-white"
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-ghibli-forest" />
          ) : (
            <Play className="h-4 w-4 text-ghibli-forest" />
          )}
        </Button>
        <div className="text-sm text-ghibli-midnight bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
          {currentSlide + 1}/{featuredLectures.length}
        </div>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full z-20 px-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/70 backdrop-blur-sm border-ghibli-meadow hover:bg-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4 text-ghibli-forest" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/70 backdrop-blur-sm border-ghibli-meadow hover:bg-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4 text-ghibli-forest" />
        </Button>
      </div>
    </div>
  );
};

export default FeaturedLecturesCarousel;
