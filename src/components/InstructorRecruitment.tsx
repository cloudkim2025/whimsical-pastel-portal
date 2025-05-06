
import React from 'react';
import { Users, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorRecruitment: React.FC = () => {
  return (
    <section className="py-24 bg-ghibli-forest/10 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-ghibli-sunset/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ghibli-sky-blue/10 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-ghibli-meadow/20 text-ghibli-forest mb-4">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium korean-text">함께 성장하는 커뮤니티</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-ghibli-midnight korean-text">
                함께 성장할 강사를 찾습니다
              </h2>
              
              <p className="text-ghibli-stone text-lg korean-text">
                당신의 전문 지식을 나누고, 더 많은 사람들에게 영감을 주세요. 
                우리 플랫폼은 강사와 학생 모두가 함께 성장하는 환경을 지향합니다.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-ghibli-midnight korean-text">이런 강사를 찾습니다</h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-ghibli-forest mt-0.5 flex-shrink-0" />
                    <span className="korean-text">해당 분야에서 실무 경험과 전문성을 갖춘 분</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-ghibli-forest mt-0.5 flex-shrink-0" />
                    <span className="korean-text">지식을 명확하고 이해하기 쉽게 전달할 수 있는 분</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-ghibli-forest mt-0.5 flex-shrink-0" />
                    <span className="korean-text">학생들과 적극적으로 소통하고 피드백을 주실 수 있는 분</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-ghibli-forest mt-0.5 flex-shrink-0" />
                    <span className="korean-text">열정적이며 지속적인 학습과 성장을 추구하는 분</span>
                  </li>
                </ul>
              </div>
              
              <Link to="/instructor-apply" className="inline-flex items-center btn-primary">
                <span className="korean-text">강사 지원하기</span> <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="aspect-square w-full rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60" 
                  alt="강의하는 강사" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden shadow-lg rotate-6 hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=60" 
                  alt="함께 공부하는 모습" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorRecruitment;
