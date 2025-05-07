
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock lectures data with realistic images
const createMockLectures = (prefix: string) => Array(6).fill(null).map((_, idx) => {
  // Select appropriate image based on prefix and index
  const imageBase = 'https://images.unsplash.com/photo-';
  const imageIds = [
    '1498050108023-c5249f4df085',
    '1461749280684-dccba630e2f6',
    '1488590528505-98d2b5aba04b',
    '1486312338219-ce68d2c6f44d',
    '1487058792275-0ad4aaf24ca7',
    '1605810230434-7631ac76ec81',
  ];
  
  return {
    id: `${prefix}-${idx + 1}`,
    title: `${prefix === 'updated' ? '최근 업데이트된' : prefix === 'popular' ? '가장 많이 본' : '마감 임박'} 강의 ${idx + 1}`,
    instructor: `강사 ${idx + 1}`,
    image: `${imageBase}${imageIds[idx]}?auto=format&fit=crop&w=600&q=80`,
    rating: (4 + Math.random()).toFixed(1),
    price: (15000 + idx * 5000).toLocaleString(),
    bookmarks: Math.floor(Math.random() * 100),
    deadline: prefix === 'deadline' ? `${Math.floor(Math.random() * 7) + 1}일 남음` : undefined,
    updateDate: prefix === 'updated' ? `${Math.floor(Math.random() * 7) + 1}일 전` : undefined,
    viewCount: prefix === 'popular' ? `${Math.floor(Math.random() * 1000) + 100}회` : undefined,
    videoUrl: prefix === 'popular' ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' : undefined,
  };
});

const updatedLectures = createMockLectures('updated');
const popularLectures = createMockLectures('popular');
const deadlineLectures = createMockLectures('deadline');

const ClassSections: React.FC = () => {
  const updatedCarouselRef = useRef<HTMLDivElement>(null);
  const popularCarouselRef = useRef<HTMLDivElement>(null);
  const deadlineCarouselRef = useRef<HTMLDivElement>(null);
  
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
          >
            <div className="bg-white rounded-lg overflow-hidden border border-ghibli-meadow/20 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
              <div className="relative">
                <img 
                  src={lecture.image} 
                  alt={lecture.title} 
                  className="w-full h-40 object-cover"
                />
                <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
                {lecture.deadline && (
                  <div className="absolute bottom-0 left-0 bg-red-500 text-white px-3 py-1 text-xs font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {lecture.deadline}
                  </div>
                )}
                {lecture.updateDate && (
                  <div className="absolute bottom-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-medium">
                    {lecture.updateDate} 업데이트
                  </div>
                )}
                {lecture.viewCount && (
                  <div className="absolute bottom-0 left-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium">
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
