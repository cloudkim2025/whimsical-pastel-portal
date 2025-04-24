
import React from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIBootUpAnimationProps {
  onComplete: () => void;
}

const AIBootUpAnimation: React.FC<AIBootUpAnimationProps> = ({ onComplete }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        onAnimationComplete={onComplete}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          <Link to="/" className="flex items-center space-x-2">
                        <Cloud className="h-8 w-8 text-ghibli-meadow animate-float" />
                        <h1 className="text-2xl font-handwritten font-bold text-ghibli-forest">Aigongbu</h1>
                    </Link>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIBootUpAnimation;
