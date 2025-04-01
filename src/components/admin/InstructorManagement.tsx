
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, Eye, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InstructorType, InstructorStatus } from '@/types/admin';

const InstructorManagement: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorType | null>(null);

  // 임시 데이터
  const mockInstructors: InstructorType[] = [
    {
      id: 1,
      name: "김개발",
      email: "kim@example.com",
      category: "프론트엔드",
      introduction: "10년차 프론트엔드 개발자입니다. React, Vue, Angular 등 다양한 프레임워크에 능숙하며, 현재는 대기업에서 시니어 개발자로 근무하고 있습니다.",
      profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      resumeUrl: "https://example.com/resume/kim.pdf",
      appliedAt: "2023-07-15",
      status: "pending"
    },
    {
      id: 2,
      name: "이백엔드",
      email: "lee@example.com",
      category: "백엔드",
      introduction: "Java와 Spring Boot를 활용한 백엔드 시스템 개발 전문가입니다. MSA, Docker, Kubernetes 등의 기술 스택을 활용한 프로젝트 경험이 있습니다.",
      profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Molly",
      resumeUrl: "https://example.com/resume/lee.pdf",
      appliedAt: "2023-08-20",
      status: "approved"
    },
    {
      id: 3,
      name: "박데이터",
      email: "park@example.com",
      category: "데이터 사이언스",
      introduction: "Python과 R을 활용한 데이터 분석 및 머신러닝 모델 개발 경험이 있습니다. 현재는 AI 스타트업에서 데이터 사이언티스트로 근무하고 있습니다.",
      profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      resumeUrl: "https://example.com/resume/park.pdf",
      appliedAt: "2023-09-10",
      status: "rejected"
    },
  ];

  const filteredInstructors = mockInstructors.filter(instructor => {
    if (filter !== 'all' && instructor.status !== filter) return false;
    if (searchTerm && !instructor.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = (instructorId: number, newStatus: InstructorStatus) => {
    // 실제 구현에서는 API 호출 필요
    console.log(`Instructor ${instructorId} status changed to ${newStatus}`);
    // 상태 변경 후 목업 데이터 업데이트 로직 (실제 구현에서는 API 응답 후 상태 업데이트)
  };

  const getStatusBadge = (status: InstructorStatus) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">승인됨</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">거절됨</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-amber-500">대기중</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold korean-text">강사 지원자 관리</h2>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="강사 검색..."
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
          <TabsTrigger value="pending" className="korean-text">대기중</TabsTrigger>
          <TabsTrigger value="approved" className="korean-text">승인됨</TabsTrigger>
          <TabsTrigger value="rejected" className="korean-text">거절됨</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredInstructors.map(instructor => (
            <Card key={instructor.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={instructor.profileImageUrl} alt={instructor.name} />
                    <AvatarFallback>{instructor.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg korean-text">{instructor.name}</h3>
                        <p className="text-sm text-muted-foreground">{instructor.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="korean-text">{instructor.category}</Badge>
                        {getStatusBadge(instructor.status)}
                      </div>
                    </div>
                    <p className="text-sm line-clamp-2 mb-3 korean-text">{instructor.introduction}</p>
                    <div className="flex flex-wrap gap-2 justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        신청일: {new Date(instructor.appliedAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => setSelectedInstructor(instructor)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="text-xs korean-text">상세보기</span>
                        </Button>
                        
                        {instructor.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center gap-1"
                              onClick={() => handleStatusChange(instructor.id, 'approved')}
                            >
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              <span className="text-xs korean-text">승인</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center gap-1"
                              onClick={() => handleStatusChange(instructor.id, 'rejected')}
                            >
                              <X className="h-3.5 w-3.5 text-red-500" />
                              <span className="text-xs korean-text">거절</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredInstructors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground korean-text">검색 결과가 없습니다</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedInstructor && (
        <Dialog open={!!selectedInstructor} onOpenChange={(open) => !open && setSelectedInstructor(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="korean-text">강사 상세정보</DialogTitle>
              <DialogDescription>
                {selectedInstructor.email} • 신청일: {new Date(selectedInstructor.appliedAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={selectedInstructor.profileImageUrl} alt={selectedInstructor.name} />
                  <AvatarFallback>{selectedInstructor.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold korean-text">{selectedInstructor.name}</h3>
                <Badge variant="outline" className="mt-2 korean-text">{selectedInstructor.category}</Badge>
                <div className="mt-4">
                  {getStatusBadge(selectedInstructor.status)}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1 korean-text">자기소개</h4>
                    <p className="text-sm text-muted-foreground korean-text">{selectedInstructor.introduction}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-1 korean-text">이력서</h4>
                    <a 
                      href={selectedInstructor.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      이력서 다운로드
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              {selectedInstructor.status === 'pending' ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      handleStatusChange(selectedInstructor.id, 'approved');
                      setSelectedInstructor(null);
                    }}
                  >
                    <Check className="h-4 w-4" />
                    <span className="korean-text">승인</span>
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      handleStatusChange(selectedInstructor.id, 'rejected');
                      setSelectedInstructor(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="korean-text">거절</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setSelectedInstructor(null)}
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

export default InstructorManagement;
