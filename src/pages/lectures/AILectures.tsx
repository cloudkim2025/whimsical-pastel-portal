
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, BookmarkPlus, Bot, Cpu, Code, Database, Video, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock categories and lectures data
const categories = [
  { id: 'html-css', name: 'HTML/CSS', Icon: Code },
  { id: 'javascript', name: 'JavaScript', Icon: Code },
  { id: 'python', name: 'Python', Icon: Code },
  { id: 'devops', name: 'DevOps', Icon: Cpu },
  { id: 'data', name: '데이터 분석', Icon: Database },
  { id: 'video', name: '영상 편집', Icon: Video },
  { id: 'design', name: 'UX/UI 디자인', Icon: Palette },
];

const lecturesData = Array(12).fill(null).map((_, idx) => ({
  id: `ai-lecture-${idx}`,
  title: `AI와 함께하는 ${categories[idx % categories.length].name} 마스터 클래스`,
  aiTutor: `${['헬퍼', '튜터', '어시스턴트', '코치', '멘토'][idx % 5]} AI`,
  image: `https://api.dicebear.com/7.x/shapes/svg?seed=ai${idx}`,
  category: categories[idx % categories.length].id,
  rating: (4 + Math.random()).toFixed(1),
  price: (15000 + idx * 1000).toLocaleString(),
  bookmarks: Math.floor(Math.random() * 100),
}));

const AILectures: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [bookmarkedLectures, setBookmarkedLectures] = useState<string[]>([]);
  
  const toggleBookmark = (lectureId: string) => {
    setBookmarkedLectures(prev => 
      prev.includes(lectureId)
        ? prev.filter(id => id !== lectureId)
        : [...prev, lectureId]
    );
  };
  
  const filteredLectures = lecturesData.filter(
    lecture => lecture.category === selectedCategory
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto pt-32 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-handwritten text-ghibli-forest mb-4">
            AI 강의
          </h1>
          <p className="text-lg text-ghibli-stone max-w-2xl mx-auto">
            전문 분야에 특화된 AI 튜터와 함께 공부해보세요. 24시간 질문 응답, 맞춤형 피드백, 실시간 코드 리뷰까지 제공됩니다.
          </p>
        </motion.div>
        
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
              <category.Icon className="h-4 w-4 mr-2" />
              {category.name} AI 튜터
            </Button>
          ))}
        </div>
        
        {/* Lectures Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
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
                </div>
                <CardContent className="p-4">
                  <Link to={`/lecture/${lecture.id}`}>
                    <div className="mb-1">
                      <span className="px-2 py-1 text-xs font-medium bg-ghibli-cloud text-ghibli-forest rounded-full">
                        {categories.find(c => c.id === lecture.category)?.name} AI
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 text-ghibli-midnight hover:text-ghibli-forest transition-colors">
                      {lecture.title}
                    </h3>
                    <p className="text-sm text-ghibli-stone mb-3 flex items-center">
                      <Bot className="h-4 w-4 mr-1 text-purple-500" /> {lecture.aiTutor}
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
        
        {/* View all button */}
        <div className="flex justify-center mt-12">
          <div className="bg-white p-6 rounded-xl shadow-md border border-ghibli-meadow/20 max-w-xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-purple-100">
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-ghibli-midnight">AI 튜터와의 강의란?</h3>
                <p className="text-ghibli-stone">각 분야에 특화된 인공지능이 여러분의 학습 패턴을 분석하고 실시간으로 질문에 답변합니다. 맞춤형 피드백과 개인화된 학습경로로 더 효율적인 학습을 경험하세요.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AILectures;
