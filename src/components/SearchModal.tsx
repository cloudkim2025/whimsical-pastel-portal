import React, {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Search} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {Input} from '@/components/ui/input';
import {lectureAPI} from '@/api/lecture';

interface Course {
  lectureId: number;
  title: string;
  category: string;
  description: string;
  thumbnailUrl: string;
}

interface SearchModalProps {
  onClose?: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 서버에서 강의 검색 (전체 목록 or 필터된 목록)
  useEffect(() => {
    const fetchLectures = async () => {
      if (searchQuery.trim() === '') {
        setFilteredCourses([]);
        setIsModalOpen(false);
        return;
      }

      try {
        const response = await lectureAPI.getLectures(); // category 검색용이면 param 추가
        const allCourses: Course[] = response.data;

        const filtered = allCourses.filter(course =>
            (course.title?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            (course.description?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            (course.category?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
        );

        setFilteredCourses(filtered);
        setIsModalOpen(filtered.length > 0);
      } catch (error) {
        console.error('강의 검색 실패:', error);
        setFilteredCourses([]);
        setIsModalOpen(false);
      }
    };

    const timeout = setTimeout(fetchLectures, 300); // debounce (optional)
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // 외부 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // 강조 표시
  const highlightMatch = (text: string | undefined | null, query: string): string => {
    if (!text) return '';
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
                        <div
                            key={course.lectureId}
                            onClick={() => {
                              setIsModalOpen(false);
                              navigate(`/lecture/${course.lectureId}`);
                            }}
                            className="flex items-start p-3 hover:bg-ghibli-cloud/30 transition-colors rounded-md cursor-pointer"
                        >
                          <img
                              src={course.thumbnailUrl}
                              alt={course.title}
                              className="w-12 h-12 rounded object-cover mr-3 flex-shrink-0"
                          />
                          <div>
                      <span className="px-2 py-0.5 text-xs font-medium bg-ghibli-cloud text-ghibli-forest rounded-full mb-1 inline-block">
                        {course.category}
                      </span>
                            <h4
                                className="font-medium text-ghibli-midnight mb-1"
                                dangerouslySetInnerHTML={{
                                  __html: highlightMatch(course.title, searchQuery),
                                }}
                            />
                            <p
                                className="text-xs text-ghibli-stone line-clamp-2"
                                dangerouslySetInnerHTML={{
                                  __html: highlightMatch(course.description, searchQuery),
                                }}
                            />
                          </div>
                        </div>
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
