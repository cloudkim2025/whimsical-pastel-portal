import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, BookmarkPlus, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import axios from 'axios';

const categories = [
  { id: 'frontend', name: '프론트엔드' },
  { id: 'backend', name: '백엔드' },
  { id: 'mobile', name: '모바일' },
  { id: 'data', name: '데이터 사이언스' },
  { id: 'ai', name: '인공지능' },
  { id: 'devops', name: 'DevOps' },
  { id: 'database', name: '데이터베이스' },
];

interface Lecture {
  id: string;
  title: string;
  instructor: string;
  imageUrl: string;
  category: string;
  rating: number;
  price: number;
  bookmarks: number;
}

const DevLectures: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [bookmarkedLectures, setBookmarkedLectures] = useState<string[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const { isInstructor } = useAuth();

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await axios.get('http://localhost:9004/api/lectures');
        const mapped = res.data.map((lecture: any) => ({
          id: String(lecture.lectureId),
          title: lecture.title,
          instructor: lecture.instructorName,
          imageUrl: lecture.thumbnailUrl,
          category: lecture.category,
          rating: lecture.rating ?? 4.0,
          price: lecture.price,
          bookmarks: lecture.bookmarkCount ?? 0
        }));
        setLectures(mapped);
      } catch (err) {
        console.error('강의 데이터를 불러오지 못했습니다:', err);
      }
    };
    fetchLectures();
  }, []);

  const toggleBookmark = (lectureId: string) => {
    setBookmarkedLectures((prev) =>
        prev.includes(lectureId)
            ? prev.filter((id) => id !== lectureId)
            : [...prev, lectureId]
    );
  };

  const filteredLectures = selectedCategory
      ? lectures.filter((lecture) => lecture.category === selectedCategory)
      : lectures;


  return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto pt-32 px-4 pb-16">
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
          >
            <h1 className="text-4xl font-handwritten text-ghibli-forest">개발강의</h1>
            {isInstructor && (
                <Link to="/lecture-upload">
                  <Button className="btn-secondary flex items-center gap-2 font-korean">
                    <PlusCircle size={16} />
                    <span>강의 등록</span>
                  </Button>
                </Link>
            )}
          </motion.div>

          {/* 카테고리 선택 */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
                <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    className={`rounded-full px-5 py-2 font-medium transition-all font-korean
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

          {/* 강의 카드 */}
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
                          src={lecture.imageUrl}
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
                      <span className="px-2 py-1 text-xs font-medium bg-ghibli-cloud text-ghibli-forest rounded-full font-korean">
                        {categories.find((c) => c.id === lecture.category)?.name}
                      </span>
                        </div>
                        <h3 className="font-semibold mb-2 text-ghibli-midnight hover:text-ghibli-forest transition-colors font-korean">
                          {lecture.title}
                        </h3>
                        <p className="text-sm text-ghibli-stone mb-3 font-korean">
                          {lecture.instructor || '이름 없음'}
                        </p>
                        <div className="flex items-center space-x-1 mb-4">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{lecture.rating}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-ghibli-midnight font-korean">₩{lecture.price.toLocaleString()}</span>
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

          <div className="flex justify-center mt-12">
            <Link to="/top-lectures" className="btn-primary font-korean">
              인기 강의 모두 보기
            </Link>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default DevLectures;
