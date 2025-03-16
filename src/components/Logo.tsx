
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  textSize?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '', textSize = 'text-xl' }) => {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 group ${className}`}
    >
      <img 
        src="/lovable-uploads/f5349c92-5133-425b-bff1-3f822a1861d1.png" 
        alt="Comparado" 
        className="h-9 md:h-11" 
      />
    </Link>
  );
};

export default Logo;
