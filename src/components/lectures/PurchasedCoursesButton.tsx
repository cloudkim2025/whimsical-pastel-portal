
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Card, CardContent } from '@/components/ui/card';

// Mock purchased courses data - in a real app this would come from an API
const mockPurchasedCourses = [
  {
    id: 'course-1',
    title: '웹 개발의 모든 것 1',
    instructor: '김강사 1',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=1',
    progress: 45,
  },
  {
    id: 'course-2',
    title: 'React 마스터 클래스',
    instructor: '박강사',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=2',
    progress: 80,
  },
  {
    id: 'course-3',
    title: 'Node.js 백엔드 개발',
    instructor: '이튜터',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=3',
    progress: 20,
  },
  {
    id: 'course-4',
    title: 'TypeScript 완벽 가이드',
    instructor: '정개발',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=4',
    progress: 10,
  },
];

const PurchasedCoursesButton: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleCourseClick = (courseId: string) => {
    navigate(`/lecture/${courseId}`);
  };
  
  if (!isAuthenticated) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="fixed bottom-20 right-6 z-30"
    >
      <Drawer>
        <DrawerTrigger asChild>
          <Button 
            className="rounded-full bg-ghibli-meadow hover:bg-ghibli-forest text-white shadow-lg flex items-center gap-2 px-6"
          >
            <BookOpen className="w-5 h-5" />
            <span>내 강의</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh] overflow-auto">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-xl font-bold text-ghibli-forest">내 수강 중인 강의</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            {mockPurchasedCourses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                아직 구매한 강의가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {mockPurchasedCourses.map((course) => (
                  <Card 
                    key={course.id} 
                    className="border border-ghibli-meadow/20 hover:border-ghibli-meadow cursor-pointer transition-all"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <CardContent className="p-3 flex items-center">
                      <img 
                        src={course.image}
                        alt={course.title}
                        className="w-16 h-16 object-cover rounded-md mr-3"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-ghibli-forest">{course.title}</h4>
                        <p className="text-sm text-ghibli-stone">{course.instructor}</p>
                        <div className="mt-1 bg-ghibli-cloud rounded-full h-1.5">
                          <div 
                            className="bg-ghibli-meadow h-1.5 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-right text-ghibli-stone mt-0.5">{course.progress}% 완료</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-4">
              <DrawerClose asChild>
                <Button 
                  variant="outline" 
                  className="border-ghibli-meadow text-ghibli-forest hover:bg-ghibli-cloud"
                  onClick={() => navigate('/profile?tab=purchases')}
                >
                  모든 강의 보기
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </motion.div>
  );
};

export default PurchasedCoursesButton;
