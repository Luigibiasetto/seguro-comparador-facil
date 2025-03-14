
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
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full blur opacity-60 group-hover:opacity-90 transition duration-500"></div>
        <div className="relative flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md">
          <span className="text-brand-600 font-bold">V</span>
        </div>
      </div>
      <span className={`font-extrabold ${textSize} bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500`}>
        ViagemSegura
      </span>
    </Link>
  );
};

export default Logo;
