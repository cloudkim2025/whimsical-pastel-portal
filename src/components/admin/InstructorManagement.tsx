
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// 가상의 강사 지원 데이터
const mockInstructors = [
  {
    id: 1,
    name: "김지훈",
    email: "jihoon.kim@example.com",
    category: "프론트엔드",
    introduction: "10년 이상의 웹 개발 경력을 가진 프론트엔드 전문가입니다. React, Vue.js, Angular 등 다양한 프레임워크를 다룹니다.",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format&q=60",
    resumeUrl: "#",
    appliedAt: "2023-03-15",
    status: "pending"
  },
  {
    id: 2,
    name: "이미라",
    email: "mira.lee@example.com",
    category: "백엔드",
    introduction: "Java와 Spring 전문 개발자로, 8년간 다양한 엔터프라이즈 시스템을 구축했습니다. REST API 설계와 서버 아키텍처에 전문성을 가지고 있습니다.",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&auto=format&q=60",
    resumeUrl: "#",
    appliedAt: "2023-03-18",
    status: "approved"
  },
  {
    id: 3,
    name: "박준호",
    email: "junho.park@example.com",
    category: "DevOps",
    introduction: "클라우드 인프라와 CI/CD 파이프라인 구축 전문가입니다. AWS, Docker, Kubernetes를 활용한 시스템 자동화에 강점이 있습니다.",
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format&q=60",
    resumeUrl: "#",
    appliedAt: "2023-03-20",
    status: "rejected"
  },
  {
    id: 4,
    name: "최서연",
    email: "seoyeon.choi@example.com",
    category: "AI/머신러닝",
    introduction: "인공지능과 머신러닝 알고리즘 개발 및 최적화 전문가입니다. Python, TensorFlow, PyTorch를 활용한 다양한 AI 모델 개발 경험이 있습니다.",
    profileImageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format&q=60",
    resumeUrl: "#",
    appliedAt: "2023-03-22",
    status: "pending"
  },
  {
    id: 5,
    name: "강동욱",
    email: "dongwook.kang@example.com",
    category: "모바일",
    introduction: "iOS 및 Android 네이티브 앱 개발자입니다. Flutter와 React Native를 활용한 크로스 플랫폼 개발도 가능합니다.",
    profileImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&auto=format&q=60",
    resumeUrl: "#",
    appliedAt: "2023-03-25",
    status: "pending"
  }
];

interface InstructorType {
  id: number;
  name: string;
  email: string;
  category: string;
  introduction: string;
  profileImageUrl: string;
  resumeUrl: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const InstructorManagement: React.FC = () => {
  const { toast } = useToast();
  const [instructors, setInstructors] = useState<InstructorType[]>(mockInstructors);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredInstructors = instructors.filter(instructor => 
    (activeTab === 'pending' && instructor.status === 'pending') ||
    (activeTab === 'approved' && instructor.status === 'approved') ||
    (activeTab === 'rejected' && instructor.status === 'rejected')
  );

  const handleViewDetails = (instructor: InstructorType) => {
    setSelectedInstructor(instructor);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (id: number, newStatus: 'approved' | 'rejected') => {
    setInstructors(prevInstructors => 
      prevInstructors.map(instructor => 
        instructor.id === id ? { ...instructor, status: newStatus } : instructor
      )
    );
    
    const statusText = newStatus === 'approved' ? '승인' : '거절';
    toast({
      title: `강사 지원 ${statusText} 완료`,
      description: `강사 지원이 ${statusText}되었습니다.`
    });
    
    if (isDialogOpen) {
      setIsDialogOpen(false);
    }
  };

  return (
    <div>
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="pending" className="korean-text">대기중</TabsTrigger>
          <TabsTrigger value="approved" className="korean-text">승인됨</TabsTrigger>
          <TabsTrigger value="rejected" className="korean-text">거절됨</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <h2 className="text-xl font-semibold korean-text mb-4">대기 중인 강사 지원</h2>
          {filteredInstructors.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground korean-text">대기 중인 지원서가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInstructors.map(instructor => (
                <InstructorCard 
                  key={instructor.id}
                  instructor={instructor}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <h2 className="text-xl font-semibold korean-text mb-4">승인된 강사</h2>
          {filteredInstructors.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground korean-text">승인된 강사가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInstructors.map(instructor => (
                <InstructorCard 
                  key={instructor.id}
                  instructor={instructor}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <h2 className="text-xl font-semibold korean-text mb-4">거절된 지원</h2>
          {filteredInstructors.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground korean-text">거절된 지원이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInstructors.map(instructor => (
                <InstructorCard 
                  key={instructor.id}
                  instructor={instructor}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedInstructor && (
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="korean-text text-xl mb-2">강사 지원 상세 정보</DialogTitle>
              <DialogDescription className="korean-text">
                지원자의 상세 정보를 확인하고 승인 여부를 결정합니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 pt-4">
              <div className="mx-auto md:mx-0">
                <img 
                  src={selectedInstructor.profileImageUrl} 
                  alt={selectedInstructor.name} 
                  className="w-24 h-24 object-cover rounded-full" 
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg korean-text">{selectedInstructor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedInstructor.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {selectedInstructor.email}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    지원일: {selectedInstructor.appliedAt}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium korean-text mb-1">자기소개</h4>
                  <p className="text-sm korean-text">{selectedInstructor.introduction}</p>
                </div>
                
                <div>
                  <h4 className="font-medium korean-text mb-1">이력서</h4>
                  <Button variant="outline" size="sm">
                    <span className="korean-text">이력서 다운로드</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {selectedInstructor.status === 'pending' && (
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => handleUpdateStatus(selectedInstructor.id, 'rejected')}
                >
                  <X className="w-4 h-4 mr-1" />
                  <span className="korean-text">거절</span>
                </Button>
                <Button 
                  onClick={() => handleUpdateStatus(selectedInstructor.id, 'approved')}
                >
                  <Check className="w-4 h-4 mr-1" />
                  <span className="korean-text">승인</span>
                </Button>
              </div>
            )}
            
            {selectedInstructor.status !== 'pending' && (
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => handleUpdateStatus(selectedInstructor.id, 'pending')}
                >
                  <span className="korean-text">상태 변경</span>
                </Button>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

interface InstructorCardProps {
  instructor: InstructorType;
  onViewDetails: (instructor: InstructorType) => void;
  onUpdateStatus: (id: number, status: 'approved' | 'rejected') => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ 
  instructor, 
  onViewDetails,
  onUpdateStatus
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={instructor.profileImageUrl} 
              alt={instructor.name} 
              className="w-10 h-10 rounded-full object-cover" 
            />
            <div>
              <CardTitle className="text-lg korean-text">{instructor.name}</CardTitle>
              <CardDescription>{instructor.email}</CardDescription>
            </div>
          </div>
          
          {instructor.status === 'pending' && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <span className="korean-text">대기중</span>
            </Badge>
          )}
          
          {instructor.status === 'approved' && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <span className="korean-text">승인됨</span>
            </Badge>
          )}
          
          {instructor.status === 'rejected' && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              <span className="korean-text">거절됨</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground korean-text line-clamp-2">
          {instructor.introduction}
        </p>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <span className="text-xs text-muted-foreground">
          {instructor.appliedAt}
        </span>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onViewDetails(instructor)}>
            <Eye className="w-4 h-4 mr-1" />
            <span className="korean-text">상세</span>
          </Button>
          
          {instructor.status === 'pending' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-500 hover:bg-red-50"
                onClick={() => onUpdateStatus(instructor.id, 'rejected')}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-green-500 hover:bg-green-50"
                onClick={() => onUpdateStatus(instructor.id, 'approved')}
              >
                <Check className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default InstructorManagement;
