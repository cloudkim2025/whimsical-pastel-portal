
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, BookmarkPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface LectureCardProps {
  lecture: {
    id: string;
    title: string;
    instructor: string;
    image: string;
    category: string;
    rating: string;
    price: string;
    bookmarks: number;
    isAI?: boolean;
    rank?: number;
  };
  categoryLabels: Record<string, string>;
  isBookmarked: boolean;
  onToggleBookmark: (lectureId: string) => void;
}

const LectureCard: React.FC<LectureCardProps> = ({ 
  lecture, 
  categoryLabels, 
  isBookmarked, 
  onToggleBookmark 
}) => {
  return (
    <motion.div
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
          {lecture.rank && (
            <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center bg-ghibli-forest text-white font-bold">
              {lecture.rank}
            </div>
          )}
          <button 
            onClick={() => onToggleBookmark(lecture.id)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white"
          >
            {isBookmarked ? (
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
                {categoryLabels[lecture.category] || '기타'}
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
  );
};

export default LectureCard;
