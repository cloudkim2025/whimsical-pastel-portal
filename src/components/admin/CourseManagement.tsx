
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { Search, Trash2, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// 가상의 강의 데이터
const mockCourses = [
  {
    id: 1,
    title: "React 완전 정복",
    description: "React의 기초부터 고급 개념까지 완벽하게 배울 수 있는 강의입니다. Hook, Context API, Redux 등을 다룹니다.",
    instructor: "김지훈",
    category: "프론트엔드",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    publishedAt: "2023-04-10",
    status: "published"
  },
  {
    id: 2,
    title: "Spring Boot와 JPA 실무",
    description: "Spring Boot와 JPA를 활용한 실무 애플리케이션 개발 방법을 배웁니다. REST API, 인증, 배포 등을 다룹니다.",
    instructor: "이미라",
    category: "백엔드",
    thumbnailUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60",
    publishedAt: "2023-04-12",
    status: "pending"
  },
  {
    id: 3,
    title: "AWS 클라우드 아키텍처 마스터",
    description: "AWS의 다양한 서비스를 활용하여 확장 가능하고 안정적인 클라우드 아키텍처를 설계하는 방법을 배웁니다.",
    instructor: "박준호",
    category: "DevOps",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    publishedAt: "2023-04-15",
    status: "published"
  },
  {
    id: 4,
    title: "파이썬으로 시작하는 머신러닝",
    description: "파이썬과 주요 라이브러리를 활용하여 머신러닝의 기본 개념과 알고리즘을 배우고 실제 프로젝트에 적용하는 방법을 익힙니다.",
    instructor: "최서연",
    category: "AI/머신러닝",
    thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60",
    publishedAt: "2023-04-18",
    status: "pending"
  },
  {
    id: 5,
    title: "Flutter 앱 개발 실전",
    description: "Flutter를 활용한 크로스 플랫폼 모바일 앱 개발의 전체 과정을 배웁니다. UI 디자인부터 상태 관리, API 연동까지 다룹니다.",
    instructor: "강동욱",
    category: "모바일",
    thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60",
    publishedAt: "2023-04-20",
    status: "published"
  }
];

interface CourseType {
  id: number;
  title: string;
  description: string;
  instructor: string;
  category: string;
  thumbnailUrl: string;
  publishedAt: string;
  status: 'published' | 'pending';
}

const CourseManagement: React.FC = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseType[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<CourseType | null>(null);
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseToDelete.id));
      
      toast({
        title: "강의 삭제 완료",
        description: `"${courseToDelete.title}" 강의가 삭제되었습니다.`
      });
      
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const openDeleteDialog = (course: CourseType) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold korean-text">등록된 강의 관리</h2>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="강의 또는 강사 검색..."
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground korean-text">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onDeleteClick={openDeleteDialog} 
            />
          ))}
        </div>
      )}
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="korean-text">강의 삭제 확인</DialogTitle>
            <DialogDescription className="korean-text">
              정말 이 강의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          
          {courseToDelete && (
            <div className="py-4">
              <p className="font-medium korean-text">{courseToDelete.title}</p>
              <p className="text-sm text-muted-foreground korean-text">강사: {courseToDelete.instructor}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              <span className="korean-text">취소</span>
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <span className="korean-text">삭제</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CourseCardProps {
  course: CourseType;
  onDeleteClick: (course: CourseType) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onDeleteClick }) => {
  return (
    <Card>
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 right-2">
          {course.status === 'pending' ? (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <span className="korean-text">승인 대기중</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <span className="korean-text">게시됨</span>
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg korean-text line-clamp-1">{course.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>{course.instructor}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{course.category}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground korean-text line-clamp-2">
          {course.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <span className="text-xs text-muted-foreground">
          {course.publishedAt}
        </span>
        
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={`/course/${course.id}`}>
              <Eye className="w-4 h-4 mr-1" />
              <span className="korean-text">보기</span>
            </Link>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-500 hover:bg-red-50"
            onClick={() => onDeleteClick(course)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseManagement;
