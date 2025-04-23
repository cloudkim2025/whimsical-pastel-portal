import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { UserCircle, Bell, Lock, BookOpen, Play } from 'lucide-react';
import {authAPI} from "@/api";
import {tokenManager} from "@/utils/tokenManager.ts";

const mockPurchasedCourses = [
  {
    id: 'course1',
    title: '웹 개발의 모든 것',
    instructor: '김강사 1',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=course1',
    progress: 45,
    totalLectures: 9,
    completedLectures: 4
  },
  {
    id: 'course2',
    title: 'React 마스터 클래스',
    instructor: '박강사',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=course2',
    progress: 20,
    totalLectures: 12,
    completedLectures: 2
  },
  {
    id: 'ai-course1',
    title: '데이터 사이언스 기초 - AI 강의',
    instructor: 'AI 튜터 1',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ai-course1',
    progress: 80,
    totalLectures: 10,
    completedLectures: 8
  }
];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [activeTab, setActiveTab] = useState('account');
  const { updateUserFromToken } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      toast.error('닉네임을 입력해주세요!');
      return;
    }

    try {
      const res = await authAPI.updateNickname(nickname);

      if (res.data?.success && res.data.token) {
        // 1️⃣ 새 토큰 저장
        tokenManager.setToken(res.data.token);

        // 2️⃣ 유저 정보 context에 반영
        updateUserFromToken();

        // 3️⃣ 알림 표시
        toast.success(res.data.message || '닉네임이 변경되었습니다!');

        setTimeout(() => {
          window.location.reload(); // 또는 navigate(0)
        }, 3000);
      } else {
        toast.error(res.data.message || '닉네임 변경에 실패했습니다.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || '오류가 발생했습니다.');
    }
  };

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-ghibli-meadow">로딩 중...</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <Header />

        <div className="pt-28 pb-16 container mx-auto px-4">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-handwritten text-ghibli-forest mb-2">내 프로필</h1>
              <p className="text-ghibli-stone mb-8">계정 정보를 확인하고 관리하세요</p>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                  <Card className="border-ghibli-meadow/30 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-3">
                        <Avatar className="h-24 w-24 border-4 border-ghibli-meadow">
                          {user.profileImage ? (
                              <AvatarImage src={user.profileImage} alt={user.nickname} />
                          ) : (
                              <AvatarFallback className="bg-ghibli-earth text-ghibli-forest text-lg">
                                {user.nickname?.slice(0, 2).toUpperCase() || 'U'}
                              </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <CardTitle className="text-xl text-ghibli-forest">{user.nickname}</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <Button
                          variant="outline"
                          className="w-full text-rose-600 border-rose-200 hover:bg-rose-50"
                          onClick={logout}
                      >
                        로그아웃
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="w-full md:w-2/3">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-6 bg-ghibli-cloud">
                      <TabsTrigger value="account" className="data-[state=active]:bg-ghibli-meadow data-[state=active]:text-white">
                        <UserCircle className="h-4 w-4 mr-2" /> 계정
                      </TabsTrigger>
                      <TabsTrigger value="security" className="data-[state=active]:bg-ghibli-meadow data-[state=active]:text-white">
                        <Lock className="h-4 w-4 mr-2" /> 보안
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="data-[state=active]:bg-ghibli-meadow data-[state=active]:text-white">
                        <Bell className="h-4 w-4 mr-2" /> 알림
                      </TabsTrigger>
                      <TabsTrigger value="courses" className="data-[state=active]:bg-ghibli-meadow data-[state=active]:text-white">
                        <BookOpen className="h-4 w-4 mr-2" /> 구매한 강의
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="account">
                      <Card className="border-ghibli-meadow/30 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-ghibli-forest">계정 정보</CardTitle>
                          <CardDescription>프로필 정보를 업데이트하세요</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="nickname">닉네임</Label>
                              <Input
                                  id="nickname"
                                  value={nickname}
                                  onChange={(e) => setNickname(e.target.value)}
                                  className="border-ghibli-meadow/50 focus:border-ghibli-forest"
                              />
                            </div>
                            <Button type="submit" className="mt-4 bg-ghibli-meadow hover:bg-ghibli-forest text-white">
                              저장하기
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="security">
                      <Card className="border-ghibli-meadow/30 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-ghibli-forest">보안</CardTitle>
                          <CardDescription>비밀번호 및 계정 보안 설정</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">현재 비밀번호</Label>
                              <Input id="current-password" type="password" className="border-ghibli-meadow/50 focus:border-ghibli-forest" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">새 비밀번호</Label>
                              <Input id="new-password" type="password" className="border-ghibli-meadow/50 focus:border-ghibli-forest" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                              <Input id="confirm-password" type="password" className="border-ghibli-meadow/50 focus:border-ghibli-forest" />
                            </div>
                            <Button className="mt-4 bg-ghibli-meadow hover:bg-ghibli-forest text-white">비밀번호 변경</Button>
                          </form>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                      <Card className="border-ghibli-meadow/30 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-ghibli-forest">알림 설정</CardTitle>
                          <CardDescription>이메일 및 푸시 알림 설정을 관리하세요</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {/* 알림 스위치 3개 유지 */}
                            {["마케팅 이메일", "보안 알림", "앱 알림"].map((label, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-sm font-medium">{label}</h4>
                                    <p className="text-xs text-ghibli-stone">알림 설명 텍스트</p>
                                  </div>
                                  <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ghibli-meadow"></div>
                                  </div>
                                </div>
                            ))}
                          </div>
                          <Button className="mt-6 bg-ghibli-meadow hover:bg-ghibli-forest text-white">설정 저장</Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="courses">
                      <Card className="border-ghibli-meadow/30 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-ghibli-forest">구매한 강의</CardTitle>
                          <CardDescription>결제 완료한 강의 목록과 진행 상황</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {mockPurchasedCourses.map((course) => (
                                <div key={course.id} className="border border-ghibli-meadow/20 rounded-lg overflow-hidden">
                                  <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/4">
                                      <img src={course.image} alt={course.title} className="h-40 md:h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h3 className="font-medium text-ghibli-forest">{course.title}</h3>
                                          <p className="text-sm text-ghibli-stone">{course.instructor}</p>
                                        </div>
                                        <Link to={`/course/${course.id}`}>
                                          <Button variant="outline" size="sm" className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50">
                                            <Play className="h-3 w-3" /> 강의 보기
                                          </Button>
                                        </Link>
                                      </div>
                                      <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                          <span>진행률: {course.progress}%</span>
                                          <span>{course.completedLectures}/{course.totalLectures} 강의 완료</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div className="bg-ghibli-meadow h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                      </div>
                                      <div className="mt-4 text-sm text-ghibli-stone">
                                        마지막 수강: 2023년 12월 15일
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
  );
};

export default Profile;
