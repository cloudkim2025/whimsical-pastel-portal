
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

// Mock tutor data
const tutors = [
  {
    id: 'tutor-1',
    name: '김웹개발',
    title: '프론트엔드 전문가',
    thumbnailUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=tutor1',
    videoUrl: 'https://example.com/video1.mp4', // This would be a real video URL in production
  },
  {
    id: 'tutor-2',
    name: '박백엔드',
    title: '서버 개발 전문가',
    thumbnailUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=tutor2',
    videoUrl: 'https://example.com/video2.mp4',
  },
  {
    id: 'tutor-3',
    name: '이데이터',
    title: '데이터 사이언티스트',
    thumbnailUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=tutor3',
    videoUrl: 'https://example.com/video3.mp4',
  },
  {
    id: 'tutor-4',
    name: '최AI',
    title: 'AI 튜터',
    thumbnailUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=tutor4',
    videoUrl: 'https://example.com/video4.mp4',
  },
  {
    id: 'tutor-5',
    name: '정모바일',
    title: '앱 개발자',
    thumbnailUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=tutor5',
    videoUrl: 'https://example.com/video5.mp4',
  },
];

const TutorShorts: React.FC = () => {
  const [activeShort, setActiveShort] = useState<string | null>(null);
  
  return (
    <div className="py-12 bg-ghibli-cloud/30 rounded-xl">
      <h2 className="text-2xl md:text-3xl font-handwritten text-center text-ghibli-forest mb-8">
        인기 튜터 숏츠
      </h2>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {tutors.map((tutor, idx) => (
            <motion.div
              key={tutor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative rounded-xl overflow-hidden aspect-[9/16] shadow-md group"
              onMouseEnter={() => setActiveShort(tutor.id)}
              onMouseLeave={() => setActiveShort(null)}
            >
              {/* In a real implementation, this would be a video element */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
              
              <img 
                src={tutor.thumbnailUrl} 
                alt={tutor.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-white font-medium">{tutor.name}</h3>
                <p className="text-white/80 text-sm">{tutor.title}</p>
              </div>
              
              {activeShort === tutor.id ? (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Pause className="h-12 w-12 text-white/90" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-12 w-12 text-white/90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorShorts;
