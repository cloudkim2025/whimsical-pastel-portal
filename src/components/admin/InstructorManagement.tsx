import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, Eye, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { authAPI } from '@/api/auth';
import { verificationAPI } from '@/api';
import {
  InstructorStatus,
  InstructorType,
  InstructorListResponse,
  InstructorDetailResponse,
} from '@/types/admin';

const InstructorManagement: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [instructors, setInstructors] = useState<InstructorType[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorDetailResponse | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState<boolean>(true);
  const navigate = useNavigate();

  // 관리자 권한 확인
  useEffect(() => {
    (async () => {
      try {
        const res = await authAPI.getUserRole();
        if (res.data?.role !== 'ADMIN') {
          toast.error('관리자 권한이 필요합니다.');
          navigate('/', { replace: true });
        }
      } catch {
        toast.error('권한 확인 중 오류가 발생했습니다.');
        navigate('/', { replace: true });
      } finally {
        setIsCheckingRole(false);
      }
    })();
  }, [navigate]);

  // 강사 목록 조회
  const fetchInstructors = async () => {
    try {
      const res = await verificationAPI.getTeacherList(
          1,
          30,
          filter === 'all' ? undefined : filter,
      );
      const data = res.data as InstructorListResponse;
      if (data.success) {
        setInstructors(data.teachers);
      } else {
        toast.error(data.message || '강사 목록 조회에 실패했습니다.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || '서버 오류로 강사 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    if (!isCheckingRole) fetchInstructors();
  }, [filter, isCheckingRole]);

  // 상태 변경
  const handleStatusChange = async (userId: number, approve: boolean) => {
    try {
      const res = await verificationAPI.updateTeacherStatus(userId, approve);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchInstructors();
      } else {
        toast.error(res.data.message || '상태 변경 실패');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || '서버 오류로 상태 변경 실패');
    }
  };

  // 상세 조회
  const handleViewDetail = async (userId: number) => {
    try {
      const res = await verificationAPI.getAdminTeacherDetail(userId);
      const data = res.data as InstructorDetailResponse;
      if (data.success) {
        setSelectedInstructor(data);
      } else {
        toast.error(data.message || '상세 조회 실패');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || '서버 오류로 상세 조회 실패');
    }
  };

  // 상태 배지
  const getStatusBadge = (status: InstructorStatus) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500 korean-text">승인됨</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-500 korean-text">거절됨</Badge>;
      default:
        return <Badge className="bg-amber-500 korean-text">대기중</Badge>;
    }
  };

  if (isCheckingRole) return null;

  return (
      <div className="space-y-6">
        {/* 헤더 & 검색 영역 */}
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

        {/* 탭 필터 */}
        <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="korean-text">전체</TabsTrigger>
            <TabsTrigger value="PENDING" className="korean-text">대기중</TabsTrigger>
            <TabsTrigger value="APPROVED" className="korean-text">승인됨</TabsTrigger>
            <TabsTrigger value="REJECTED" className="korean-text">거절됨</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {instructors
                .filter((i) =>
                    i.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((instructor) => (
                    <Card key={instructor.userId}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                                src={instructor.profileImage || '/default-avatar.png'}
                                alt={instructor.name}
                            />
                            <AvatarFallback>
                              {instructor.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                              <div>
                                <h3 className="font-semibold text-lg korean-text">
                                  {instructor.name}
                                </h3>
                                <p className="text-sm text-muted-foreground korean-text">
                                  {instructor.category}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(instructor.status)}
                              </div>
                            </div>
                            <p className="text-sm line-clamp-2 mb-3 korean-text">
                              {instructor.bio || '소개가 없습니다.'}
                            </p>
                            <div className="flex flex-wrap gap-2 justify-between items-center">
                              <div className="text-xs text-muted-foreground korean-text">
                                신청일:{' '}
                                {instructor.createdAt
                                    ? new Date(instructor.createdAt).toLocaleDateString()
                                    : '-'}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetail(instructor.userId)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span className="text-xs korean-text">상세보기</span>
                                </Button>
                                {instructor.status === 'PENDING' && (
                                    <>
                                      <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleStatusChange(instructor.userId, true)}
                                      >
                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                        <span className="text-xs korean-text">승인</span>
                                      </Button>
                                      <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleStatusChange(instructor.userId, false)}
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
            {instructors.length === 0 && (
                <div className="text-center py-12 korean-text">
                  검색 결과가 없습니다
                </div>
            )}
          </TabsContent>
        </Tabs>

        {/* 상세 다이얼로그 */}
        {selectedInstructor && (
            <Dialog open onOpenChange={() => setSelectedInstructor(null)}>
              <DialogContent className="max-w-3xl korean-text">
                <DialogHeader>
                  <DialogTitle>강사 상세정보</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-32 h-32 mb-4">
                      <AvatarImage
                          src={selectedInstructor.profileImage}
                          alt={selectedInstructor.name}
                      />
                      <AvatarFallback>
                        {selectedInstructor.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold korean-text">
                      {selectedInstructor.name}
                    </h3>
                    <Badge variant="outline" className="mt-2 korean-text">
                      {selectedInstructor.category}
                    </Badge>
                    <div className="mt-4">
                      {getStatusBadge(selectedInstructor.status)}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h4 className="font-semibold korean-text">자기소개</h4>
                      <p className="text-sm text-muted-foreground korean-text">
                        {selectedInstructor.bio || '소개가 없습니다.'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold korean-text">이력서</h4>
                      <a
                          href={selectedInstructor.resumeFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline korean-text"
                      >
                        이력서 다운로드
                      </a>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  {selectedInstructor.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                              handleStatusChange(selectedInstructor.userId, true);
                              setSelectedInstructor(null);
                            }}
                        >
                          <Check className="h-4 w-4" /> 승인
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                              handleStatusChange(selectedInstructor.userId, false);
                              setSelectedInstructor(null);
                            }}
                        >
                          <X className="h-4 w-4" /> 거절
                        </Button>
                      </div>
                  ) : (
                      <Button
                          variant="outline"
                          onClick={() => setSelectedInstructor(null)}
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
