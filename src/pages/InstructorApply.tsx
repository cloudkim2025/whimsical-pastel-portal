import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InstructorApplicationForm from '@/components/instructor/InstructorApplicationForm';

const InstructorApply: React.FC = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-ghibli-midnight mb-6" lang="ko">강사 지원서</h1>
            <p className="text-ghibli-stone mb-8 korean-text">함께 성장할 수 있는 교육 플랫폼에 강사로 참여해보세요. 심사 후 승인이 완료되면 강의를 업로드하실 수 있습니다.</p>
            
            <InstructorApplicationForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstructorApply;
