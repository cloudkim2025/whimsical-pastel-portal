
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import GlassmorphicCard from './GlassmorphicCard';

const PhilosophySection: React.FC = () => {
  const { scrollYProgress } = useScroll();

  const philosophyItems = [
    {
      title: "개인화된 학습",
      desc: "각 학습자의 필요, 관심사, 학습 스타일에 맞춘 교육을 제공합니다."
    },
    {
      title: "지속적인 성장",
      desc: "끊임없는 학습과 자기 개발을 통해 진정한 성장을 이룰 수 있도록 돕습니다."
    },
    {
      title: "창의적 혁신",
      desc: "전통적인 교육 방식을 넘어, 혁신적인 기술과 방법론을 적극 활용합니다."
    }
  ];

  return (
    <section className="py-10">
      <GlassmorphicCard className="overflow-hidden" variant="default">
        <div className="relative h-64 overflow-hidden rounded-2xl m-6">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-sm"
            style={{ 
              y: useTransform(scrollYProgress, [0, 1], [0, -50]),
              scale: useTransform(scrollYProgress, [0, 1], [1, 1.2])
            }}
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/30">
              <RotateCw className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-handwritten my-4 text-white drop-shadow-lg">교육 철학</h2>
            <p className="text-center max-w-md mx-auto px-4 text-white/90 font-medium">
              우리는 모든 사람이 자신만의 속도와 방식으로 배울 권리가 있다고 믿습니다.
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophyItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
                whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <h3 className="text-xl font-medium mb-3 text-white drop-shadow-sm">{item.title}</h3>
                <p className="text-white/90 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>
    </section>
  );
};

export default PhilosophySection;
