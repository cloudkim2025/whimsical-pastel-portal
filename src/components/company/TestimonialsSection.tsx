
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

const testimonials = [
  { name: "김지현", role: "프론트엔드 개발자", quote: "기초부터 실무까지 체계적으로 배울 수 있어서 좋았습니다. 특히 AI 튜터의 24시간 지원이 큰 도움이 되었어요." },
  { name: "박민수", role: "데이터 사이언티스트", quote: "이론과 실습이 완벽하게 균형을 이루는 강의들이 인상적이었습니다. 실무에 바로 적용할 수 있는 지식을 얻었습니다." },
  { name: "이서연", role: "UI/UX 디자이너", quote: "디자인과 코딩의 경계를 넘나드는 다양한 강의들을 통해 새로운 시각을 얻게 되었어요." },
  { name: "최준호", role: "백엔드 개발자", quote: "커뮤니티를 통한 동료들과의 교류가 학습 동기를 높여주었고, 실제 프로젝트에도 큰 도움이 되었습니다." }
];

const TestimonialsSection: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-6">
        <Award className="h-6 w-6 text-ghibli-forest mr-3" />
        <h2 className="text-2xl font-handwritten text-center text-ghibli-forest">고객 후기</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
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
  );
};

export default TestimonialsSection;
