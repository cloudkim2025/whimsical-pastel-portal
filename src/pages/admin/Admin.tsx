
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InstructorManagement from '@/components/admin/InstructorManagement';
import LectureManagement from '@/components/admin/LectureManagement';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  CreditCard, 
  Mail,
  Calendar, 
  Clock,
  Send 
} from 'lucide-react';
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from '@/components/ui/drawer';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('instructors');
  const [recipientType, setRecipientType] = useState('all');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [notificationTime, setNotificationTime] = useState('12:00');
  const [notificationSubject, setNotificationSubject] = useState('');
  const [notificationContent, setNotificationContent] = useState('');

  useEffect(() => {
    // URL 경로에서 현재 탭 확인
    const path = location.pathname.split('/').pop();
    if (path === 'lectures') {
      setActiveTab('lectures');
    } else if (path === 'payments') {
      setActiveTab('payments');
    } else if (path === 'messages') {
      setActiveTab('messages');
    } else {
      setActiveTab('instructors');
    }
  }, [location]);

  // 관리자 권한 체크
  useEffect(() => {
    if (!isAdmin) {
      toast.error("관리자 권한이 필요합니다.");
    }
  }, [isAdmin]);

  const handleSendEmail = () => {
    // This would connect to an API in a real application
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }
    
    toast.success(`${recipientType === 'all' ? '모든 사용자' : 
                   recipientType === 'instructors' ? '강사' : '학생'}에게 이메일을 발송했습니다.`);
    
    // Reset form
    setEmailSubject('');
    setEmailContent('');
  };

  const handleScheduleNotification = () => {
    // This would connect to an API in a real application
    if (!notificationSubject.trim() || !notificationContent.trim() || !selectedDate || !notificationTime) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }
    
    const formattedDate = selectedDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    toast.success(`${formattedDate} ${notificationTime}에 알림이 예약되었습니다.`);
    
    // Reset form
    setNotificationSubject('');
    setNotificationContent('');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>접근 권한 없음</AlertTitle>
              <AlertDescription>
                관리자 계정으로 로그인해야 이 페이지에 접근할 수 있습니다.
                <div className="mt-4 space-y-2">
                  <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                    홈으로 돌아가기
                  </Button>
                  <Button onClick={() => navigate('/login')} className="w-full">
                    관리자 로그인하기
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-8" lang="ko">
            관리자 페이지 <span className="text-lg font-normal text-ghibli-stone">({user?.nickname})</span>
          </h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 w-full max-w-3xl mx-auto">
              <TabsTrigger value="instructors" className="flex-1" asChild>
                <Link to="/admin/instructors" className="korean-text w-full">강사 관리</Link>
              </TabsTrigger>
              <TabsTrigger value="lectures" className="flex-1" asChild>
                <Link to="/admin/lectures" className="korean-text w-full">강의 관리</Link>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex-1" asChild>
                <Link to="/admin/payments" className="korean-text w-full">결제 관리</Link>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex-1" asChild>
                <Link to="/admin/messages" className="korean-text w-full">메시지 관리</Link>
              </TabsTrigger>
            </TabsList>
            
            <Routes>
              <Route path="/" element={<Navigate to="instructors" replace />} />
              <Route path="instructors" element={<InstructorManagement />} />
              <Route path="lectures" element={<LectureManagement />} />
              <Route path="payments" element={
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        결제 관리
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        이 섹션에서는 플랫폼의 모든 결제를 관리할 수 있습니다.
                      </p>
                      <div className="grid gap-4">
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/payment-history')}
                          className="w-full md:w-auto"
                        >
                          결제 내역 보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              } />
              <Route path="messages" element={
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Email Sending Card */}
                  <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        이메일 보내기
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="recipient">수신자 선택</Label>
                          <Select value={recipientType} onValueChange={setRecipientType}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="수신자 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">모든 사용자</SelectItem>
                              <SelectItem value="instructors">강사</SelectItem>
                              <SelectItem value="students">학생</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject">제목</Label>
                          <Input 
                            id="subject" 
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            placeholder="이메일 제목" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="content">내용</Label>
                          <Textarea 
                            id="content" 
                            value={emailContent}
                            onChange={(e) => setEmailContent(e.target.value)}
                            placeholder="이메일 내용" 
                            rows={5} 
                          />
                        </div>
                        
                        <Button 
                          onClick={handleSendEmail}
                          className="w-full bg-ghibli-meadow hover:bg-ghibli-forest"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          이메일 보내기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Scheduled Notification Card */}
                  <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        예약 알림
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>날짜 선택</Label>
                          <div className="border rounded-md p-1">
                            <CalendarComponent
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              className="mx-auto"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="time">시간 선택</Label>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="time" 
                              type="time"
                              value={notificationTime}
                              onChange={(e) => setNotificationTime(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="notif-subject">제목</Label>
                          <Input 
                            id="notif-subject" 
                            value={notificationSubject}
                            onChange={(e) => setNotificationSubject(e.target.value)}
                            placeholder="알림 제목" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="notif-content">내용</Label>
                          <Textarea 
                            id="notif-content" 
                            value={notificationContent}
                            onChange={(e) => setNotificationContent(e.target.value)}
                            placeholder="알림 내용" 
                            rows={3} 
                          />
                        </div>
                        
                        <Button 
                          onClick={handleScheduleNotification}
                          className="w-full bg-ghibli-meadow hover:bg-ghibli-forest"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          알림 예약하기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              } />
            </Routes>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
