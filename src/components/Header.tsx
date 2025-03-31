
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Cloud, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-500',
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-3' : 'py-6'
    )}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cloud className="h-8 w-8 text-ghibli-meadow animate-float" />
          <h1 className="text-2xl font-handwritten font-bold text-ghibli-forest">Studio Dreamscape</h1>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-ghibli-forest"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="nav-link">Home</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#gallery" className="nav-link">Gallery</a>
          <a href="#contact" className="nav-link">Contact</a>
          <button className="btn-primary">Get Started</button>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn(
        'md:hidden fixed inset-x-0 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out transform shadow-lg',
        isMenuOpen ? 'top-[calc(100%)] opacity-100' : '-top-[400px] opacity-0'
      )}>
        <nav className="container mx-auto px-6 py-6 flex flex-col space-y-4">
          <a href="#" className="nav-link text-lg py-2">Home</a>
          <a href="#features" className="nav-link text-lg py-2">Features</a>
          <a href="#gallery" className="nav-link text-lg py-2">Gallery</a>
          <a href="#contact" className="nav-link text-lg py-2">Contact</a>
          <button className="btn-primary mt-2">Get Started</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
