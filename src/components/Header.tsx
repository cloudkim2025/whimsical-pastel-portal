
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Cloud, Menu, X, UserCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/#features" className="nav-link">Features</Link>
          <Link to="/#gallery" className="nav-link">Gallery</Link>
          <Link to="/#contact" className="nav-link">Contact</Link>
          
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center"
              >
                <Avatar className="h-10 w-10 border-2 border-ghibli-meadow hover:border-ghibli-forest transition-all duration-300">
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.nickname} />
                  ) : (
                    <AvatarFallback className="bg-ghibli-earth text-ghibli-forest">
                      {user?.nickname?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-ghibli-meadow/20 overflow-hidden"
                  >
                    <div className="p-4 border-b border-ghibli-earth/10">
                      <p className="text-ghibli-forest font-medium">{user?.nickname}</p>
                      <p className="text-sm text-ghibli-stone truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/profile" 
                        className="block px-4 py-2 text-sm text-ghibli-forest hover:bg-ghibli-cloud rounded-md"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        내 프로필
                      </Link>
                      <Link to="/settings" 
                        className="block px-4 py-2 text-sm text-ghibli-forest hover:bg-ghibli-cloud rounded-md"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        설정
                      </Link>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                      >
                        로그아웃
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="nav-link">로그인</Link>
              <Link to="/register" className="btn-primary">회원가입</Link>
            </div>
          )}
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn(
        'md:hidden fixed inset-x-0 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out transform shadow-lg',
        isMenuOpen ? 'top-[calc(100%)] opacity-100' : '-top-[400px] opacity-0'
      )}>
        <nav className="container mx-auto px-6 py-6 flex flex-col space-y-4">
          <Link to="/" className="nav-link text-lg py-2">Home</Link>
          <Link to="/#features" className="nav-link text-lg py-2">Features</Link>
          <Link to="/#gallery" className="nav-link text-lg py-2">Gallery</Link>
          <Link to="/#contact" className="nav-link text-lg py-2">Contact</Link>
          
          {isAuthenticated ? (
            <div className="pt-2 border-t border-ghibli-earth/10">
              <div className="flex items-center space-x-3 p-2">
                <Avatar className="h-10 w-10 border-2 border-ghibli-meadow">
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.nickname} />
                  ) : (
                    <AvatarFallback className="bg-ghibli-earth text-ghibli-forest">
                      {user?.nickname?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium text-ghibli-forest">{user?.nickname}</p>
                  <p className="text-sm text-ghibli-stone truncate">{user?.email}</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <Link to="/profile" className="block px-2 py-2 text-ghibli-forest hover:bg-ghibli-cloud rounded-md">
                  내 프로필
                </Link>
                <Link to="/settings" className="block px-2 py-2 text-ghibli-forest hover:bg-ghibli-cloud rounded-md">
                  설정
                </Link>
                <button 
                  className="w-full text-left px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  onClick={logout}
                >
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-ghibli-earth/10 flex flex-col space-y-3">
              <Link to="/login" className="py-2 px-4 text-ghibli-forest text-center border border-ghibli-meadow rounded-full hover:bg-ghibli-cloud">
                로그인
              </Link>
              <Link to="/register" className="btn-primary">회원가입</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
