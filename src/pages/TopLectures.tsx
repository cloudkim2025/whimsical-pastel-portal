
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, BookmarkPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock categories and lectures data
const categories = [
  { id: 'all', name: '전체보기' },
  { id: 'frontend', name: '프론트엔드' },
  { id: 'backend', name: '백엔드' },
  { id: 'mobile', name: '모바일' },
  { id: 'data', name: '데이터 사이언스' },
  { id: 'ai', name: '인공지능' },
];

const generateTopLecturesData = () => {
  return Array(20).fill(null).map((_, idx) => ({
    id: `top-lecture-${idx}`,
    title: `인기 강의 ${idx + 1}`,
    instructor: idx % 3 === 0 ? `AI 튜터 ${idx % 10}` : `김강사 ${idx % 10}`,
    image: `https://api.dicebear.com/7.x/shapes/svg?seed=top${idx}`,
    category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
    rating: (4 + Math.random()).toFixed(1),
    price: (15000 + idx * 500).toLocaleString(),
    bookmarks: Math.floor(Math.random() * 200) + 100,
    isAI: idx % 3 === 0,
    rank: idx + 1,
  }));
};

const TopLectures: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarkedLectures, setBookmarkedLectures] = useState<string[]>([]);
  const lecturesData = generateTopLecturesData();
  
  const toggleBookmark = (lectureId: string) => {
    setBookmarkedLectures(prev => 
      prev.includes(lectureId)
        ? prev.filter(id => id !== lectureId)
        : [...prev, lectureId]
    );
  };
  
  const filteredLectures = selectedCategory === 'all'
    ? lecturesData
    : lecturesData.filter(lecture => lecture.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto pt-32 px-4 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-handwritten text-center text-ghibli-forest mb-8"
        >
          인기 TOP 20 강의
        </motion.h1>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className={`
                rounded-full px-5 py-2 font-medium transition-all
                ${selectedCategory === category.id 
                  ? 'bg-ghibli-meadow hover:bg-ghibli-forest text-white' 
                  : 'border-ghibli-meadow/50 text-ghibli-forest hover:border-ghibli-forest hover:bg-ghibli-cloud'}
              `}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        {/* Lectures Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {filteredLectures.map((lecture) => (
            <motion.div
              key={lecture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="overflow-hidden h-full border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={lecture.image} 
                    alt={lecture.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center bg-ghibli-forest text-white font-bold">
                    {lecture.rank}
                  </div>
                  <button 
                    onClick={() => toggleBookmark(lecture.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white"
                  >
                    {bookmarkedLectures.includes(lecture.id) ? (
                      <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    ) : (
                      <Heart className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {lecture.isAI && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 text-xs font-medium bg-ghibli-sunset text-white rounded-full">
                      AI 튜터
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <Link to={`/lecture/${lecture.id}`}>
                    <div className="mb-1">
                      <span className="px-2 py-1 text-xs font-medium bg-ghibli-cloud text-ghibli-forest rounded-full">
                        {categories.find(c => c.id === lecture.category)?.name || '기타'}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 text-ghibli-midnight hover:text-ghibli-forest transition-colors">
                      {lecture.title}
                    </h3>
                    <p className="text-sm text-ghibli-stone mb-3">
                      {lecture.instructor}
                    </p>
                    <div className="flex items-center space-x-1 mb-4">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{lecture.rating}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-ghibli-midnight">₩{lecture.price}</span>
                      <div className="flex items-center text-xs text-ghibli-stone">
                        <BookmarkPlus className="h-3 w-3 mr-1" /> {lecture.bookmarks}
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default TopLectures;
