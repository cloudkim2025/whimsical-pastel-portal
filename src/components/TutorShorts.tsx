
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Improved tutor data with the provided images and videos
const tutors = [
  {
    id: 'tutor-1',
    name: '김인공',
    title: 'AI 전문가',
    thumbnailUrl: 'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/tv01.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    topic: 'AI로 보는 세상'
  },
  {
    id: 'tutor-2',
    name: '박웹개발',
    title: '웹 개발 전문가',
    thumbnailUrl: 'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/tv02.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    topic: 'OAuth2 로그인 시스템 구현'
  },
  {
    id: 'tutor-3',
    name: '이클라우드',
    title: '클라우드 아키텍트',
    thumbnailUrl: 'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/tv03.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    topic: 'AWS로 시작하는 클라우드 인프라'
  },
  {
    id: 'tutor-4',
    name: '최모바일',
    title: 'iOS 앱 개발자',
    thumbnailUrl: 'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/tv04.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    topic: 'iOS 앱 개발 입문'
  },
  {
    id: 'tutor-5',
    name: '정백엔드',
    title: '백엔드 개발자',
    thumbnailUrl: 'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/tv05.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    topic: 'REST API 설계와 보안'
  },
];

const TutorShorts: React.FC = () => {
  const [activeShort, setActiveShort] = useState<string | null>(null);
  const [muted, setMuted] = useState<boolean>(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  
  const handleMouseEnter = (tutorId: string) => {
    setActiveShort(tutorId);
    const video = videoRefs.current[tutorId];
    if (video) {
      video.currentTime = 0;
      video.play().catch(err => console.error("Video play failed:", err));
    }
  };
  
  const handleMouseLeave = (tutorId: string) => {
    setActiveShort(null);
    const video = videoRefs.current[tutorId];
    if (video) {
      video.pause();
    }
  };
  
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted(!muted);
    
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.muted = !muted;
      }
    });
  };
  
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
              className="relative rounded-xl overflow-hidden aspect-[9/16] shadow-md group cursor-pointer"
              onMouseEnter={() => handleMouseEnter(tutor.id)}
              onMouseLeave={() => handleMouseLeave(tutor.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
              
              <img 
                src={tutor.thumbnailUrl} 
                alt={tutor.name} 
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${activeShort === tutor.id ? 'opacity-0' : 'opacity-100'}`}
              />
              
              <video
                ref={el => videoRefs.current[tutor.id] = el}
                src={tutor.videoUrl}
                className={`absolute inset-0 w-full h-full object-cover ${activeShort === tutor.id ? 'opacity-100' : 'opacity-0'}`}
                muted={muted}
                playsInline
                loop
                preload="metadata"
              />
              
              <div className="absolute top-3 left-3 z-20">
                <div className="bg-ghibli-meadow text-white px-3 py-1 text-xs font-medium rounded-full">
                  {tutor.topic}
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-white font-medium">{tutor.name}</h3>
                <p className="text-white/80 text-sm">{tutor.title}</p>
              </div>
              
              {activeShort === tutor.id && (
                <>
                  <div className="absolute top-3 right-3 z-20">
                    <button 
                      onClick={toggleMute}
                      className="p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-colors"
                    >
                      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Pause className="h-12 w-12 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </>
              )}
              
              {activeShort !== tutor.id && (
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
