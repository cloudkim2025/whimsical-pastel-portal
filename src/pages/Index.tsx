
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import CategoryNav from '@/components/CategoryNav';
import PopularCoursesCarousel from '@/components/PopularCoursesCarousel';
import TutorShorts from '@/components/TutorShorts';
import ClassSections from '@/components/ClassSections';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <div className="container mx-auto px-4 md:px-6">
        <FeaturedCarousel />
        <CategoryNav />
        <PopularCoursesCarousel />
      </div>
      <div className="container mx-auto px-4 md:px-6 mt-8">
        <TutorShorts />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <ClassSections />
      </div>
      <Features />
      <Gallery />
      <Footer />
    </div>
  );
};

export default Index;
