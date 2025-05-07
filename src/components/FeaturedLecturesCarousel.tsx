
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Updated featured lectures data with realistic images and text overlays
const featuredLectures = [
  {
    id: 'featured-1',
    title: 'AI로 보는 세상: 딥러닝 기초부터 실전까지',
    instructor: '김인공 교수',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    price: '129,000',
    description: '최신 AI 기술과 머신러닝의 핵심을 이해하고 실무에 적용하는 방법을 배우세요',
  },
  {
    id: 'featured-2',
    title: '프론트엔드 개발자를 위한 React 완벽 가이드',
    instructor: '박웹개발 강사',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    price: '149,000',
    description: 'React 18의 새로운 기능부터 실전 프로젝트까지 현직 개발자의 노하우를 배워보세요',
  },
  {
    id: 'featured-3',
    title: '데이터 사이언티스트 완성 과정',
    instructor: '정데이터 박사',
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    price: '159,000',
    description: '데이터 분석, 시각화부터 머신러닝 알고리즘 구현까지 실무 중심의 강의',
  },
  {
    id: 'featured-4',
    title: '클라우드 서비스 완전 정복',
    instructor: '강클라우드 아키텍트',
    image: 'https://images.unsplash.com/photo-1560523159-4a9692d222f9?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    price: '179,000',
    description: 'AWS, Azure, GCP를 활용한 클라우드 인프라 설계와 운영의 모든 것',
  },
  {
    id: 'featured-5',
    title: '풀스택 개발자 부트캠프',
    instructor: '신풀스택 개발자',
    image: 'public/lovable-uploads/d555527f-18a3-4f59-a2e3-6db9291a20da.png',
    rating: 4.6,
    price: '239,000',
    description: 'AI로 보는 세상: 딥러닝, 자연어처리, 생성형 AI까지 인공지능의 핵심을 한 번에',
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
                      {index === 4 ? "AI로 보는 세상" : lecture.title.split(':')[0]}
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
