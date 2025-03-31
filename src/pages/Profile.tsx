
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Settings, UserCircle, Bell, Lock } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(user?.nickname || '');

  // If no user is logged in, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be an API call in a real app
    toast.success("프로필이 업데이트 되었습니다!");
  };

  // If still loading or no user, show loading state
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
            <p className="text-ghibli-stone mb-8">
              계정 정보를 확인하고 관리하세요
            </p>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Summary Card */}
              <div className="w-full md:w-1/3">
                <Card className="border-ghibli-meadow/30 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-3">
                      <Avatar className="h-24 w-24 border-4 border-ghibli-meadow">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.nickname} />
                        ) : (
                          <AvatarFallback className="bg-ghibli-earth text-ghibli-forest text-lg">
                            {user.nickname?.slice(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <CardTitle className="text-xl text-ghibli-forest">{user.nickname}</CardTitle>
                    <CardDescription className="text-ghibli-stone">{user.email}</CardDescription>
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
              
              {/* Settings Tabs */}
              <div className="w-full md:w-2/3">
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="mb-6 bg-ghibli-cloud">
                    <TabsTrigger value="account" className="data-[state=active]:bg-ghibli-meadow data-[state=active]:text-white">
                      <UserCircle className="h-4 w-4 mr-2" />
                      계정
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-ghibli-meadow data-[state=active]:text-white">
                      <Lock className="h-4 w-4 mr-2" />
                      보안
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-ghibli-meadow data-[state=active]:text-white">
                      <Bell className="h-4 w-4 mr-2" />
                      알림
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="account">
                    <Card className="border-ghibli-meadow/30 bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-ghibli-forest">계정 정보</CardTitle>
                        <CardDescription>
                          프로필 정보를 업데이트하세요
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                              id="email"
                              type="email"
                              value={user.email}
                              disabled
                              className="bg-ghibli-cloud/30"
                            />
                            <p className="text-xs text-ghibli-stone">이메일은 변경할 수 없습니다</p>
                          </div>
                          
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
                        <CardDescription>
                          비밀번호 및 계정 보안 설정
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">현재 비밀번호</Label>
                            <Input
                              id="current-password"
                              type="password"
                              className="border-ghibli-meadow/50 focus:border-ghibli-forest"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="new-password">새 비밀번호</Label>
                            <Input
                              id="new-password"
                              type="password"
                              className="border-ghibli-meadow/50 focus:border-ghibli-forest"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              className="border-ghibli-meadow/50 focus:border-ghibli-forest"
                            />
                          </div>
                          
                          <Button className="mt-4 bg-ghibli-meadow hover:bg-ghibli-forest text-white">
                            비밀번호 변경
                          </Button>
                        </form>
                        
                        <div className="mt-8 border-t border-ghibli-earth/10 pt-6">
                          <h4 className="text-lg font-medium text-ghibli-forest mb-4">소셜 계정 연동</h4>
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#ea4335] flex items-center justify-center text-white mr-3">G</div>
                                <span>Google</span>
                              </div>
                              <Button variant="outline" size="sm">연결</Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#03C75A] flex items-center justify-center text-white mr-3">N</div>
                                <span>Naver</span>
                              </div>
                              <Button variant="outline" size="sm">연결</Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#FEE500] flex items-center justify-center text-[#3A1D1D] mr-3">K</div>
                                <span>Kakao</span>
                              </div>
                              <Button variant="outline" size="sm">연결</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="notifications">
                    <Card className="border-ghibli-meadow/30 bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-ghibli-forest">알림 설정</CardTitle>
                        <CardDescription>
                          이메일 및 푸시 알림 설정을 관리하세요
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium">마케팅 이메일</h4>
                              <p className="text-xs text-ghibli-stone">새로운 기능 및 이벤트 알림</p>
                            </div>
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" value="" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ghibli-meadow"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium">보안 알림</h4>
                              <p className="text-xs text-ghibli-stone">계정 로그인 및 보안 관련 알림</p>
                            </div>
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" value="" className="sr-only peer" checked readOnly />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ghibli-meadow"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium">앱 알림</h4>
                              <p className="text-xs text-ghibli-stone">앱 내 알림 및 푸시 알림</p>
                            </div>
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" value="" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ghibli-meadow"></div>
                            </div>
                          </div>
                        </div>
                        
                        <Button className="mt-6 bg-ghibli-meadow hover:bg-ghibli-forest text-white">
                          설정 저장
                        </Button>
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
