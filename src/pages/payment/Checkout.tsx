
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { paymentAPI } from '@/api/payment';
import { PaymentRequest } from '@/types/payment';

declare global {
  interface Window {
    IMP: any;
  }
}

// Mock course data (same as in CourseDetail)
const getCourseData = (id: string) => ({
  id,
  title: `웹 개발의 모든 것 ${id.includes('ai') ? '- AI 강의' : ''}`,
  instructor: id.includes('ai') ? `AI 튜터 ${id.slice(-1)}` : `김강사 ${id.slice(-1)}`,
  image: `https://api.dicebear.com/7.x/shapes/svg?seed=${id}`,
  category: id.includes('ai') ? 'AI 기초' : '프론트엔드',
  price: (id.includes('ai') ? 22000 : 15000).toLocaleString(),
  duration: `${Math.floor(Math.random() * 20) + 10}시간`,
});

const Checkout: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('kakao');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load Portone SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    document.body.appendChild(script);

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('결제를 진행하려면 로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    if (courseId) {
      // In a real app, we would fetch course data from an API
      setCourse(getCourseData(courseId));
    }

    return () => {
      // Clean up script on component unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [courseId, isAuthenticated, navigate]);
  
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast.error('이용약관에 동의해주세요.');
      return;
    }

    if (!course) {
      toast.error('강의 정보를 불러오는 데 실패했습니다.');
      return;
    }
    
    setIsProcessing(true);
    
    if (paymentMethod === 'kakao') {
      processKakaoPayment();
    } else {
      // For other payment methods, you can add more handlers
      simulatePayment();
    }
  };

  const processKakaoPayment = () => {
    if (!window.IMP) {
      toast.error('결제 모듈을 불러오는데 실패했습니다. 페이지를 새로고침해 주세요.');
      setIsProcessing(false);
      return;
    }

    // 포트원 api 초기화
    window.IMP.init("imp18800044");
    
    // 결제 금액 숫자로 변환 (,를 제거하고 정수로 변환)
    const amount = parseInt(course.price.replace(/,/g, ''), 10);
    
    // 포트원 api 결제창 호출
    window.IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME", // 결제 방식
        pay_method: "card",
        merchant_uid: `kakao-${crypto.randomUUID()}`, // 주문 고유 번호
        name: course.title, // 강의 제목을 상품 이름으로
        amount: amount, // 강의 금액
        buyer_email: user?.email || "guest@example.com", // 구매자 정보
        buyer_name: user?.name || "게스트",
      },
      function (response: any) {
        // 성공했을 때 로직
        if (response.success) {
          const paymentData: PaymentRequest = {
            courseId: course.id,
            amount: response.paid_amount,
            paymentMethod: response.pg_provider
          };
          
          paymentAPI.savePayment(paymentData)
            .then(() => {
              toast.success('결제가 완료되었습니다!');
              navigate('/payment-history');
            })
            .catch(error => {
              console.error('결제 정보 저장 실패', error);
              toast.error('결제 정보 저장에 실패했습니다. 고객센터에 문의해 주세요.');
            })
            .finally(() => {
              setIsProcessing(false);
            });
        } else {
          toast.error(response.error_msg || '결제에 실패했습니다.');
          setIsProcessing(false);
        }
      }
    );
  };

  const simulatePayment = () => {
    // Simulate processing for other payment methods
    setTimeout(() => {
      toast.success('결제가 완료되었습니다!');
      navigate('/payment-history');
      setIsProcessing(false);
    }, 1500);
  };
  
  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto pt-32 px-4 pb-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghibli-forest mx-auto"></div>
          <p className="mt-4 text-ghibli-forest">정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto pt-24 px-4 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-handwritten text-center text-ghibli-forest mb-8"
        >
          결제하기
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Course summary */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border border-ghibli-meadow/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-ghibli-forest mb-4">주문 요약</h2>
                  
                  <div className="flex mb-4">
                    <img 
                      src={course.image}
                      alt={course.title}
                      className="h-20 w-20 object-cover rounded-md mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-ghibli-midnight">{course.title}</h3>
                      <p className="text-sm text-ghibli-stone">{course.instructor}</p>
                      <p className="text-sm text-ghibli-stone">{course.duration}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-b border-ghibli-earth/10 py-4 my-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-ghibli-stone">강의 가격</span>
                      <span className="text-ghibli-midnight">₩{course.price}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>총 결제금액</span>
                      <span className="text-lg text-ghibli-forest">₩{course.price}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-ghibli-stone">
                    *부가세 포함
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Middle: Payment methods */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border border-ghibli-meadow/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-ghibli-forest mb-4">결제 수단</h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 border border-ghibli-meadow/30 rounded-lg p-3 cursor-pointer hover:bg-ghibli-cloud/30 transition-colors">
                      <RadioGroupItem value="kakao" id="payment-kakao" />
                      <Label htmlFor="payment-kakao" className="cursor-pointer flex-grow">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#FEE500] rounded-md flex items-center justify-center mr-3">
                            <span className="text-[#3A1D1D] font-bold text-sm">K</span>
                          </div>
                          <div>
                            <div className="font-medium">카카오페이</div>
                            <div className="text-xs text-ghibli-stone">간편하고 빠른 결제</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border border-ghibli-earth/30 rounded-lg p-3 cursor-pointer hover:bg-ghibli-cloud/30 transition-colors">
                      <RadioGroupItem value="card" id="payment-card" />
                      <Label htmlFor="payment-card" className="cursor-pointer flex-grow">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold text-sm">C</span>
                          </div>
                          <div>
                            <div className="font-medium">신용/체크카드</div>
                            <div className="text-xs text-ghibli-stone">모든 카드 사용 가능</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border border-ghibli-earth/30 rounded-lg p-3 cursor-pointer hover:bg-ghibli-cloud/30 transition-colors">
                      <RadioGroupItem value="bank" id="payment-bank" />
                      <Label htmlFor="payment-bank" className="cursor-pointer flex-grow">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center mr-3">
                            <span className="text-green-600 font-bold text-sm">B</span>
                          </div>
                          <div>
                            <div className="font-medium">무통장 입금</div>
                            <div className="text-xs text-ghibli-stone">입금 확인 후 수강 가능</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Right: Checkout summary */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border border-ghibli-meadow/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-ghibli-forest mb-6">최종 결제</h2>
                  
                  <div className="border-b border-ghibli-earth/10 pb-4 mb-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>총 결제금액</span>
                      <span className="text-ghibli-forest">₩{course.price}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id="terms" 
                        checked={agreedToTerms} 
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      />
                      <Label 
                        htmlFor="terms" 
                        className="text-sm cursor-pointer"
                      >
                        이용약관 및 환불 정책에 동의합니다.
                      </Label>
                    </div>
                    <p className="text-xs text-ghibli-stone">
                      결제 완료 후 14일 이내 환불 가능합니다.
                    </p>
                  </div>
                  
                  <form onSubmit={handleCheckout}>
                    <Button 
                      type="submit"
                      disabled={isProcessing || !agreedToTerms}
                      className="w-full bg-ghibli-meadow hover:bg-ghibli-forest text-white transition-all duration-300"
                    >
                      {isProcessing ? '처리 중...' : '결제 완료하기'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
