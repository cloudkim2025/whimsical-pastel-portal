
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { generateTopLecturesData } from '@/data/mockTopLectures';

const PopularLecturesCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const popularLectures = generateTopLecturesData().slice(0, 8);
  
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      
      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="py-12 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-handwritten text-ghibli-forest">
          인기 강의
        </h2>
        <Link 
          to="/top-lectures" 
          className="text-sm font-medium text-ghibli-forest hover:text-ghibli-midnight flex items-center"
        >
          모두 보기 
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="relative group">
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {popularLectures.map((lecture, idx) => (
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="inline-block bg-ghibli-meadow text-white px-3 py-1 text-xs font-medium rounded-full mb-1">
                      {lecture.category === 'frontend' ? '프론트엔드' : '백엔드'}
                    </span>
                  </div>
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
                    <span className="text-xs text-ghibli-stone">(수강생 {Math.floor(Math.random() * 500) + 100}명)</span>
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
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden md:flex rounded-full bg-white shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PopularLecturesCarousel;
