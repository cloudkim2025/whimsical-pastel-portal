
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Eye, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CourseType } from '@/types/admin';

const CourseManagement: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);

  // 임시 데이터
  const mockCourses: CourseType[] = [
    {
      id: 1,
      title: "React 완전정복 - 기초부터 실전까지",
      description: "React의 핵심 개념과 실전 프로젝트를 통해 프론트엔드 개발을 마스터하세요.",
      instructor: "김개발",
      category: "프론트엔드",
      thumbnailUrl: "https://via.placeholder.com/300x200?text=React+Course",
      publishedAt: "2023-05-15",
      status: "published"
    },
    {
      id: 2,
      title: "Python으로 시작하는 AI 개발",
      description: "파이썬을 활용한 AI 개발의 기초부터 머신러닝, 딥러닝까지 배워보세요.",
      instructor: "이인공",
      category: "AI",
      thumbnailUrl: "https://via.placeholder.com/300x200?text=Python+AI",
      publishedAt: "2023-06-20",
      status: "published"
    },
    {
      id: 3,
      title: "웹 성능 최적화 마스터클래스",
      description: "느린 웹사이트를 빠르게 만드는 다양한 최적화 기법을 배워보세요.",
      instructor: "박성능",
      category: "웹개발",
      thumbnailUrl: "https://via.placeholder.com/300x200?text=Web+Performance",
      publishedAt: "2023-07-10",
      status: "pending"
    },
  ];

  const filteredCourses = mockCourses.filter(course => {
    if (filter !== 'all' && course.status !== filter) return false;
    if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = (courseId: number, newStatus: CourseType['status']) => {
    // 실제 구현에서는 API 호출 필요
    console.log(`Course ${courseId} status changed to ${newStatus}`);
    // 상태 변경 후 목업 데이터 업데이트 로직 (실제 구현에서는 API 응답 후 상태 업데이트)
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold korean-text">강의 관리</h2>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="강의 검색..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="korean-text">필터</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="korean-text">전체</TabsTrigger>
          <TabsTrigger value="published" className="korean-text">승인됨</TabsTrigger>
          <TabsTrigger value="pending" className="korean-text">대기중</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <div className="relative h-40">
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      course.status === 'published' ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                  >
                    {course.status === 'published' ? '승인됨' : '대기중'}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 korean-text">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 korean-text">
                    {course.instructor} • {course.category}
                  </p>
                  <p className="text-sm line-clamp-2 mb-4 korean-text">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setSelectedCourse(course)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span className="text-xs korean-text">상세보기</span>
                    </Button>
                    {course.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1 h-8 w-8"
                          onClick={() => handleStatusChange(course.id, 'published')}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1 h-8 w-8"
                          onClick={() => console.log(`Reject course ${course.id}`)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 korean-text">
              <p className="text-muted-foreground">검색 결과가 없습니다</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedCourse && (
        <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="korean-text">{selectedCourse.title}</DialogTitle>
              <DialogDescription className="korean-text">
                {selectedCourse.instructor} • {selectedCourse.category} • {new Date(selectedCourse.publishedAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img 
                  src={selectedCourse.thumbnailUrl} 
                  alt={selectedCourse.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div>
                <h4 className="font-semibold mb-2 korean-text">강의 설명</h4>
                <p className="text-sm text-muted-foreground korean-text">{selectedCourse.description}</p>
              </div>
            </div>

            <DialogFooter>
              {selectedCourse.status === 'pending' ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      handleStatusChange(selectedCourse.id, 'published');
                      setSelectedCourse(null);
                    }}
                  >
                    <Check className="h-4 w-4" />
                    <span className="korean-text">승인</span>
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      console.log(`Reject course ${selectedCourse.id}`);
                      setSelectedCourse(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="korean-text">거절</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setSelectedCourse(null)}
                  className="korean-text"
                >
                  닫기
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CourseManagement;
