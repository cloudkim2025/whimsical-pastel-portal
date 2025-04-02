
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarIcon } from 'lucide-react';

// This is a placeholder implementation for TopLectures
// Will be replaced with real data when API is ready

const mockTopLectures = [
  {
    id: 1,
    title: 'React 완벽 가이드',
    instructor: '김개발',
    category: 'frontend',
    rating: 4.9,
    students: 12543,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070'
  },
  {
    id: 2,
    title: 'Spring Boot 마스터 클래스',
    instructor: '박백엔드',
    category: 'backend',
    rating: 4.8,
    students: 8763,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070'
  },
  {
    id: 3,
    title: 'Flutter로 앱 개발하기',
    instructor: '최모바일',
    category: 'mobile',
    rating: 4.7,
    students: 7215,
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=2074'
  },
  {
    id: 4,
    title: '머신러닝 기초부터 심화까지',
    instructor: '이인공지능',
    category: 'ai',
    rating: 4.9,
    students: 9876,
    image: 'https://images.unsplash.com/photo-1677442135074-5425af5ad4f2?q=80&w=2070'
  },
  {
    id: 5,
    title: 'Docker와 Kubernetes 완전정복',
    instructor: '정데브옵스',
    category: 'devops',
    rating: 4.8,
    students: 6543,
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106'
  },
  {
    id: 6,
    title: 'MongoDB 데이터베이스 마스터하기',
    instructor: '강디비',
    category: 'database',
    rating: 4.6,
    students: 5432,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=2021'
  },
];

const categoryLabels: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  mobile: '모바일',
  ai: 'AI/머신러닝',
  devops: 'DevOps',
  database: '데이터베이스',
  security: '보안',
  cloud: '클라우드',
  'ui-ux': 'UI/UX',
  other: '기타'
};

const TopLectures: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-6" lang="ko">
              인기 강의
            </h1>
            <p className="text-ghibli-stone mb-8">
              수강생들이 가장 많이 선택하고, 높은 평점을 받은 인기 강의 모음입니다.
              최신 트렌드와 기술을 배울 수 있는 최고의 강의들을 만나보세요.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTopLectures.map((lecture) => (
                <Card key={lecture.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img 
                      src={lecture.image} 
                      alt={lecture.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-muted/50">
                        {categoryLabels[lecture.category] || lecture.category}
                      </Badge>
                      <div className="flex items-center text-yellow-500">
                        <StarIcon size={16} className="fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{lecture.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2" lang="ko">{lecture.title}</h3>
                    <p className="text-ghibli-stone text-sm mb-4">{lecture.instructor} 강사</p>
                    <p className="text-sm text-muted-foreground">
                      {lecture.students.toLocaleString()}명 수강 중
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TopLectures;
