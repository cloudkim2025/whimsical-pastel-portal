
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

// Mock search data
const mockCourses = [
  {
    id: 'course-1',
    title: 'React 완벽 마스터하기',
    category: 'frontend',
    categoryName: '프론트엔드',
    description: 'React 훅, 컴포넌트 패턴, 상태 관리까지 완벽하게 배우는 강의입니다.',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=1',
  },
  {
    id: 'course-2',
    title: 'Node.js로 백엔드 API 구축하기',
    category: 'backend',
    categoryName: '백엔드',
    description: 'Express.js, MongoDB, REST API 설계 및 구현을 배웁니다.',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=2',
  },
  {
    id: 'course-3',
    title: '데이터 사이언스 기초',
    category: 'data',
    categoryName: '데이터 사이언스',
    description: 'Python, Pandas, NumPy를 활용한 데이터 분석 기초를 배웁니다.',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=3',
  },
  {
    id: 'course-4',
    title: 'AI와 함께하는 HTML/CSS 마스터 클래스',
    category: 'ai',
    categoryName: 'AI 강의',
    description: 'HTML/CSS에 특화된 AI 튜터와 함께 웹 디자인의 기초부터 고급 기술까지 배웁니다.',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=4',
  },
  {
    id: 'course-5',
    title: 'DevOps 엔지니어링 with AI',
    category: 'ai',
    categoryName: 'AI 강의',
    description: 'DevOps에 특화된 AI 전문가와 함께 CI/CD, 컨테이너화, 클라우드 서비스를 마스터합니다.',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=5',
  },
  {
    id: 'course-6',
    title: 'TypeScript 완벽 가이드',
    category: 'frontend',
    categoryName: '프론트엔드',
    description: 'TypeScript의 타입 시스템, 인터페이스, 제네릭 등 모든 기능을 배웁니다.',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=6',
  },
];

interface SearchModalProps {
  onClose?: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter courses based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses([]);
      setIsModalOpen(false);
      return;
    }

    const filtered = mockCourses.filter(
      course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredCourses(filtered);
    setIsModalOpen(filtered.length > 0);
  }, [searchQuery]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 text-ghibli-midnight">$1</mark>');
  };

  return (
    <div className="relative" ref={modalRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="강의 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-full border-ghibli-meadow/30 focus:border-ghibli-forest transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ghibli-stone" />
      </div>
      
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-ghibli-meadow/20 overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
          >
            <div className="p-2">
              <p className="text-sm text-ghibli-stone px-3 py-2">
                {filteredCourses.length > 0 ? `검색 결과: ${filteredCourses.length}개` : '검색 결과가 없습니다'}
              </p>
              <div className="divide-y divide-ghibli-cloud">
                {filteredCourses.map(course => (
                  <Link 
                    key={course.id}
                    to={`/course/${course.id}`} 
                    className="flex items-start p-3 hover:bg-ghibli-cloud/30 transition-colors rounded-md"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-12 h-12 rounded object-cover mr-3 flex-shrink-0"
                    />
                    <div>
                      <span className="px-2 py-0.5 text-xs font-medium bg-ghibli-cloud text-ghibli-forest rounded-full mb-1 inline-block">
                        {course.categoryName}
                      </span>
                      <h4 
                        className="font-medium text-ghibli-midnight mb-1" 
                        dangerouslySetInnerHTML={{ 
                          __html: highlightMatch(course.title, searchQuery) 
                        }}
                      />
                      <p 
                        className="text-xs text-ghibli-stone line-clamp-2"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightMatch(course.description, searchQuery) 
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchModal;
