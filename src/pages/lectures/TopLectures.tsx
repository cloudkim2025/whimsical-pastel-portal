
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LectureCard from '@/components/lectures/LectureCard';
import CategoryFilter from '@/components/lectures/CategoryFilter';
import { generateTopLecturesData } from '@/data/mockTopLectures';
import { categories } from '@/data/lectureCategories';

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
  
  const allCategories = [
    { id: 'all', name: '전체보기' },
    ...categories
  ];

  // Create a mapping of category ids to names
  const categoryLabels: Record<string, string> = {};
  categories.forEach(category => {
    categoryLabels[category.id] = category.name;
  });
  
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
        
        <CategoryFilter 
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {filteredLectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              categoryLabels={categoryLabels}
              isBookmarked={bookmarkedLectures.includes(lecture.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TopLectures;
