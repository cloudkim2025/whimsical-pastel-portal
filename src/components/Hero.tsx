
import React from 'react';
import { ArrowDown, BookOpen } from 'lucide-react';
import { Link } from 'react-scroll';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Background Illustration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-ghibli-sky-blue/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-ghibli-cloud/50 via-transparent to-transparent" />
        <div className="absolute top-1/4 right-[-10%] w-96 h-96 rounded-full bg-ghibli-sunset/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-[-5%] w-72 h-72 rounded-full bg-ghibli-meadow/20 blur-3xl animate-float-slow" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ghibli-midnight leading-tight mb-6 animate-fade-in korean-text">
            AI와 함께 더 빠르게 성장하는 당신의 개발 여정
          </h1>
          <p className="text-lg md:text-xl text-ghibli-stone mb-10 max-w-2xl mx-auto animate-slide-up opacity-0 korean-text" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            인공지능이 당신의 학습을 돕고, 실시간으로 질문에 답하며, 개인화된 학습 경험을 제공합니다. 
            새로운 기술을 배우는 가장 효율적인 방법을 경험해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <Link to="features" smooth={true} duration={500} className="btn-primary flex items-center gap-2 cursor-pointer">
              <span className="korean-text">왜 선택해야 할까요</span> <ArrowDown className="h-4 w-4" />
            </Link>
            <Link to="motivation" smooth={true} duration={500} className="btn-secondary flex items-center gap-2 cursor-pointer">
              <span className="korean-text">동기부여 갤러리</span> <BookOpen className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 right-10 w-20 h-20 hidden md:block">
          <div className="w-full h-full bg-ghibli-forest/20 rounded-full backdrop-blur-sm animate-float" />
        </div>
        <div className="absolute bottom-1/3 left-10 w-16 h-16 hidden md:block">
          <div className="w-full h-full bg-ghibli-sunset/20 rounded-full backdrop-blur-sm animate-float-slow" />
        </div>
        <div className="absolute top-2/3 right-1/4 w-12 h-12 hidden md:block">
          <div className="w-full h-full bg-ghibli-earth/20 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
