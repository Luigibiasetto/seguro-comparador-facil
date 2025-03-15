
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';

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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-90 transition duration-500"></div>
        <div className="relative flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md">
          <BarChart2 className="h-4 w-4 text-indigo-600" />
        </div>
      </div>
      <span className={`font-extrabold ${textSize} bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-500`}>
        Comparado
      </span>
    </Link>
  );
};

export default Logo;
