
import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import GlassmorphicCard from './GlassmorphicCard';

const testimonials = [
  { name: "김지현", role: "프론트엔드 개발자", quote: "기초부터 실무까지 체계적으로 배울 수 있어서 좋았습니다. 특히 AI 튜터의 24시간 지원이 큰 도움이 되었어요." },
  { name: "박민수", role: "데이터 사이언티스트", quote: "이론과 실습이 완벽하게 균형을 이루는 강의들이 인상적이었습니다. 실무에 바로 적용할 수 있는 지식을 얻었습니다." },
  { name: "이서연", role: "UI/UX 디자이너", quote: "디자인과 코딩의 경계를 넘나드는 다양한 강의들을 통해 새로운 시각을 얻게 되었어요." },
  { name: "최준호", role: "백엔드 개발자", quote: "커뮤니티를 통한 동료들과의 교류가 학습 동기를 높여주었고, 실제 프로젝트에도 큰 도움이 되었습니다." }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-white/15 backdrop-blur-sm p-4 rounded-full border border-white/30">
          <Award className="h-6 w-6 text-white mr-3" />
        </div>
        <h2 className="text-2xl font-handwritten text-center text-white ml-4">고객 후기</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <GlassmorphicCard variant="default">
              <div className="p-6">
                <p className="text-white/90 italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold border border-white/30">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-white/70">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
