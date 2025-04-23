
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SearchModal from './SearchModal';
import Logo from './navigation/Logo';
import NavigationLinks from './navigation/NavigationLinks';
import ProfileDropdown from './navigation/ProfileDropdown';
import AuthButtons from './navigation/AuthButtons';
import MobileMenu from './navigation/MobileMenu';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  
  return (
    <header className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-500',
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-3' : 'py-6'
    )}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8">
          <Logo />
          
          <div className="hidden md:block w-64">
            <SearchModal />
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavigationLinks />
          
          {isAuthenticated ? (
            <div ref={profileRef} className="relative">
              <div onClick={toggleProfileDropdown} className="cursor-pointer">
                <Avatar className="h-10 w-10 border-2 border-ghibli-meadow">
                  {user?.profileImage ? (
                    <AvatarImage src={user.profileImage} alt={user?.nickname || ''} />
                  ) : (
                    <AvatarFallback className="bg-ghibli-earth text-ghibli-forest">
                      {user?.nickname ? user.nickname.slice(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              {isProfileOpen && <div className="absolute right-0 mt-2 z-50"><ProfileDropdown /></div>}
            </div>
          ) : (
            <AuthButtons />
          )}
        </nav>
        
        <div className="md:hidden flex items-center space-x-4">
          <button 
            className="text-ghibli-forest"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      <MobileMenu isMenuOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;
