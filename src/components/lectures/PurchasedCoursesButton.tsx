
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const PurchasedCoursesButton: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="fixed bottom-20 right-6 z-30"
    >
      <Link to="/profile?tab=purchases">
        <Button 
          className="rounded-full bg-ghibli-meadow hover:bg-ghibli-forest text-white shadow-lg flex items-center gap-2 px-6"
        >
          <BookOpen className="w-5 h-5" />
          <span>내 강의</span>
        </Button>
      </Link>
    </motion.div>
  );
};

export default PurchasedCoursesButton;
