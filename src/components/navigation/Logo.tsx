
import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Cloud className="h-8 w-8 text-ghibli-meadow animate-float" />
      <h1 className="text-2xl font-handwritten font-bold text-ghibli-forest">Aigongbu</h1>
    </Link>
  );
};

export default Logo;
