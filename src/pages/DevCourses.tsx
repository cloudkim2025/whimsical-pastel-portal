
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, BookmarkPlus, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Mock categories and courses data
const categories = [
  { id: 'frontend', name: '프론트엔드' },
  { id: 'backend', name: '백엔드' },
  { id: 'mobile', name: '모바일' },
  { id: 'data', name: '데이터 사이언스' },
  { id: 'ai', name: '인공지능' },
  { id: 'devops', name: 'DevOps' },
];

const coursesData = Array(12).fill(null).map((_, idx) => ({
  id: `course-${idx}`,
  title: `웹 개발의 모든 것 ${idx + 1}`,
  instructor: `김강사 ${idx + 1}`,
  image: `https://api.dicebear.com/7.x/shapes/svg?seed=${idx}`,
  category: categories[idx % categories.length].id,
  rating: (4 + Math.random()).toFixed(1),
  price: (15000 + idx * 1000).toLocaleString(),
  bookmarks: Math.floor(Math.random() * 100),
}));

const DevCourses: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const { isInstructor } = useAuth();
  
  const toggleBookmark = (courseId: string) => {
    setBookmarkedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };
  
  const filteredCourses = coursesData.filter(
    course => course.category === selectedCategory
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto pt-32 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-handwritten text-ghibli-forest">
            개발강의
          </h1>
          
          {isInstructor && (
            <Link to="/course-upload">
              <Button className="btn-secondary flex items-center gap-2 font-korean">
                <PlusCircle size={16} />
                <span>강의 등록</span>
              </Button>
            </Link>
          )}
        </motion.div>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className={`
                rounded-full px-5 py-2 font-medium transition-all font-korean
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
        
        {/* Courses Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="overflow-hidden h-full border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-48 object-cover"
                  />
                  <button 
                    onClick={() => toggleBookmark(course.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white"
                  >
                    {bookmarkedCourses.includes(course.id) ? (
                      <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    ) : (
                      <Heart className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                <CardContent className="p-4">
                  <Link to={`/course/${course.id}`}>
                    <div className="mb-1">
                      <span className="px-2 py-1 text-xs font-medium bg-ghibli-cloud text-ghibli-forest rounded-full font-korean">
                        {categories.find(c => c.id === course.category)?.name}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 text-ghibli-midnight hover:text-ghibli-forest transition-colors font-korean">
                      {course.title}
                    </h3>
                    <p className="text-sm text-ghibli-stone mb-3 font-korean">
                      {course.instructor}
                    </p>
                    <div className="flex items-center space-x-1 mb-4">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-ghibli-midnight font-korean">₩{course.price}</span>
                      <div className="flex items-center text-xs text-ghibli-stone">
                        <BookmarkPlus className="h-3 w-3 mr-1" /> {course.bookmarks}
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
          <Link to="/top-courses" className="btn-primary font-korean">
            인기 강의 모두 보기
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DevCourses;
