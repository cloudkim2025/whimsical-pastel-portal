
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Lightbulb, Users, Award, Target, Book, Code, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const CompanyInfo: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleStartFree = () => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto pt-32 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <Cloud className="h-16 w-16 text-ghibli-meadow mx-auto mb-4 animate-float" />
            <h1 className="text-4xl font-handwritten text-ghibli-forest mb-4">Aigongbu</h1>
            <p className="text-xl text-ghibli-stone italic">
              "인터넷 강의 및 AI와 함께 공부"
            </p>
          </div>
          
          {/* Vision Card */}
          <Card className="mb-8 overflow-hidden border border-ghibli-meadow/20 shadow-lg">
            <div className="bg-gradient-to-r from-ghibli-cloud to-ghibli-sky-blue p-6">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-ghibli-forest mr-4" />
                <h2 className="text-2xl font-handwritten text-ghibli-forest">우리의 비전</h2>
              </div>
              <CardContent className="p-0">
                <p className="text-ghibli-midnight leading-relaxed">
                  Aigongbu는 교육의 경계를 허물고 모든 사람들이 기술을 배울 수 있는 기회를 제공하는 것을 목표로 합니다. 
                  우리는 전통적인 학습 방식과 최신 AI 기술을 결합하여 보다 개인화되고 효과적인 학습 경험을 제공합니다.
                  마치 지브리 애니메이션처럼 꿈과 현실의 경계에서 새로운 가능성을 탐색하듯, 우리는 교육이 단순한 지식 전달을 넘어
                  창의성과 영감을 불어넣는 여정이 되기를 바랍니다.
                </p>
              </CardContent>
            </div>
          </Card>
          
          {/* Features Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
          >
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Book className="h-6 w-6 text-ghibli-forest mr-3" />
                    <h3 className="text-xl font-handwritten text-ghibli-forest">맞춤형 학습 경험</h3>
                  </div>
                  <p className="text-ghibli-midnight">
                    개인의 학습 속도와 스타일에 맞춘 교육 컨텐츠로 효과적인 학습을 지원합니다.
                    각자의 강점과 약점을 파악하여 최적화된 학습 경로를 제공합니다.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Code className="h-6 w-6 text-ghibli-forest mr-3" />
                    <h3 className="text-xl font-handwritten text-ghibli-forest">실무 중심 교육</h3>
                  </div>
                  <p className="text-ghibli-midnight">
                    산업 현장에서 실제로 사용되는 도구와 기술을 배우며, 
                    실습 중심의 프로젝트를 통해 실질적인 역량을 키울 수 있습니다.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Bot className="h-6 w-6 text-ghibli-forest mr-3" />
                    <h3 className="text-xl font-handwritten text-ghibli-forest">AI 통합 학습</h3>
                  </div>
                  <p className="text-ghibli-midnight">
                    최신 AI 기술을 활용한 맞춤형 학습 도우미와 함께
                    24시간 질문하고 답변받을 수 있는 환경을 제공합니다.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="h-6 w-6 text-ghibli-forest mr-3" />
                    <h3 className="text-xl font-handwritten text-ghibli-forest">활발한 커뮤니티</h3>
                  </div>
                  <p className="text-ghibli-midnight">
                    함께 공부하는 동료들과 지식을 나누고 성장할 수 있는
                    활발한 커뮤니티 활동을 지원합니다.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          {/* Educational Philosophy */}
          <Card className="mb-12 border border-ghibli-meadow/20 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-ghibli-earth to-ghibli-stone/30 p-6">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-8 w-8 text-ghibli-forest mr-4" />
                <h2 className="text-2xl font-handwritten text-ghibli-forest">교육 철학</h2>
              </div>
              <CardContent className="p-0 text-ghibli-midnight space-y-4">
                <p>
                  우리는 학습이 단순한 정보 전달이 아닌 영감을 주는 과정이라고 믿습니다. 
                  마치 지브리 스튜디오의 애니메이션이 관객에게 꿈과 상상력을 불어넣듯,
                  우리의 교육은 학생들에게 새로운 세계를 탐험할 수 있는 용기와 창의력을 심어줍니다.
                </p>
                <p>
                  기술은 빠르게 변화하지만, 학습의 본질은 변하지 않습니다. 
                  우리는 최신 기술을 활용하되, 언제나 사람과 그들의 이야기에 초점을 맞춥니다.
                  모든 학생이 자신만의 이야기를 써내려갈 수 있도록 돕는 것이 우리의 사명입니다.
                </p>
              </CardContent>
            </div>
          </Card>
          
          {/* Customer Testimonials */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <Award className="h-6 w-6 text-ghibli-forest mr-3" />
              <h2 className="text-2xl font-handwritten text-center text-ghibli-forest">고객 후기</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "김지현", role: "프론트엔드 개발자", quote: "기초부터 실무까지 체계적으로 배울 수 있어서 좋았습니다. 특히 AI 튜터의 24시간 지원이 큰 도움이 되었어요." },
                { name: "박민수", role: "데이터 사이언티스트", quote: "이론과 실습이 완벽하게 균형을 이루는 강의들이 인상적이었습니다. 실무에 바로 적용할 수 있는 지식을 얻었습니다." },
                { name: "이서연", role: "UI/UX 디자이너", quote: "디자인과 코딩의 경계를 넘나드는 다양한 강의들을 통해 새로운 시각을 얻게 되었어요." },
                { name: "최준호", role: "백엔드 개발자", quote: "커뮤니티를 통한 동료들과의 교류가 학습 동기를 높여주었고, 실제 프로젝트에도 큰 도움이 되었습니다." }
              ].map((testimonial, index) => (
                <Card key={index} className="border border-ghibli-meadow/20 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <p className="text-ghibli-midnight italic mb-4">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-ghibli-meadow/20 flex items-center justify-center text-ghibli-forest font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-ghibli-forest">{testimonial.name}</p>
                        <p className="text-sm text-ghibli-stone">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Join Us */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center pt-8"
          >
            <h2 className="text-2xl font-handwritten text-ghibli-forest mb-4">함께 성장해요</h2>
            <p className="text-ghibli-midnight mb-6 max-w-2xl mx-auto">
              Aigongbu와 함께 당신의 기술 여정을 시작하세요. 
              우리는 당신이 꿈꾸는 미래로 가는 길을 밝혀줄 준비가 되어 있습니다.
            </p>
            <Button 
              onClick={handleStartFree}
              className="py-2.5 px-5 bg-ghibli-meadow hover:bg-ghibli-forest text-white rounded-full transition-all duration-300"
            >
              무료로 시작하기
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CompanyInfo;
