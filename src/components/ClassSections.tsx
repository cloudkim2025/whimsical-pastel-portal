
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock classes data
const createMockClasses = (prefix: string) => Array(6).fill(null).map((_, idx) => ({
  id: `${prefix}-${idx + 1}`,
  title: `${prefix === 'updated' ? '최근 업데이트된' : prefix === 'popular' ? '가장 많이 본' : '마감 임박'} 클래스 ${idx + 1}`,
  instructor: `강사 ${idx + 1}`,
  image: `https://api.dicebear.com/7.x/shapes/svg?seed=${prefix}${idx + 1}`,
  rating: (4 + Math.random()).toFixed(1),
  price: (15000 + idx * 5000).toLocaleString(),
  bookmarks: Math.floor(Math.random() * 100),
  deadline: prefix === 'deadline' ? `${Math.floor(Math.random() * 7) + 1}일 남음` : undefined,
  updateDate: prefix === 'updated' ? `${Math.floor(Math.random() * 7) + 1}일 전` : undefined,
  viewCount: prefix === 'popular' ? `${Math.floor(Math.random() * 1000) + 100}회` : undefined,
}));

const updatedClasses = createMockClasses('updated');
const popularClasses = createMockClasses('popular');
const deadlineClasses = createMockClasses('deadline');

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
  
  const renderCourseList = (courses: typeof updatedClasses, ref: React.RefObject<HTMLDivElement>) => (
    <div className="relative group">
      <div 
        ref={ref}
        className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="min-w-[280px] max-w-[280px] snap-start"
          >
            <div className="bg-white rounded-lg overflow-hidden border border-ghibli-meadow/20 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-40 object-cover"
                />
                <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
                {course.deadline && (
                  <div className="absolute bottom-0 left-0 bg-red-500 text-white px-3 py-1 text-xs font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {course.deadline}
                  </div>
                )}
                {course.updateDate && (
                  <div className="absolute bottom-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-medium">
                    {course.updateDate} 업데이트
                  </div>
                )}
                {course.viewCount && (
                  <div className="absolute bottom-0 left-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium">
                    조회수 {course.viewCount}
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <Link to={`/course/${course.id}`}>
                  <h3 className="font-medium text-ghibli-midnight hover:text-ghibli-forest transition-colors mb-1 line-clamp-2 min-h-[48px]">
                    {course.title}
                  </h3>
                </Link>
                <p className="text-sm text-ghibli-stone mb-2">
                  {course.instructor}
                </p>
                <div className="flex items-center space-x-1 mb-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-bold text-ghibli-midnight">₩{course.price}</span>
                  <span className="text-xs text-ghibli-stone flex items-center">
                    <Heart className="h-3 w-3 mr-1" /> {course.bookmarks}
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
        다양한 클래스 살펴보기
      </h2>
      
      <Tabs defaultValue="updated" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md mx-auto">
          <TabsTrigger value="updated" className="text-sm">최근 업데이트</TabsTrigger>
          <TabsTrigger value="popular" className="text-sm">인기 클래스</TabsTrigger>
          <TabsTrigger value="deadline" className="text-sm">마감 임박</TabsTrigger>
        </TabsList>
        
        <TabsContent value="updated" className="mt-0">
          {renderCourseList(updatedClasses, updatedCarouselRef)}
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          {renderCourseList(popularClasses, popularCarouselRef)}
        </TabsContent>
        
        <TabsContent value="deadline" className="mt-0">
          {renderCourseList(deadlineClasses, deadlineCarouselRef)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassSections;
