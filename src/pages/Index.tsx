
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import FeaturedLecturesCarousel from '@/components/FeaturedLecturesCarousel';
import CategoryNav from '@/components/CategoryNav';
import PopularLecturesCarousel from '@/components/PopularLecturesCarousel';
import TutorShorts from '@/components/TutorShorts';
import ClassSections from '@/components/ClassSections';
import InstructorRecruitment from '@/components/InstructorRecruitment';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <div className="container mx-auto px-4 md:px-6">
        <FeaturedLecturesCarousel />
        <div className="py-12">
          <CategoryNav />
        </div>
        <PopularLecturesCarousel />
      </div>
      <div className="container mx-auto px-4 md:px-6 mt-8">
        <TutorShorts />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <ClassSections />
      </div>
      <InstructorRecruitment />
      <Gallery />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
