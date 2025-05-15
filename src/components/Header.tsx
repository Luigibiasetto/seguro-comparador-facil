import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Logo from './Logo';
import AuthButton from './AuthButton';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="w-full bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">Início</Link>
            <Link to="/como-funciona" className="text-gray-600 hover:text-gray-800">Como Funciona</Link>
            <Link to="/quem-somos" className="text-gray-600 hover:text-gray-800">Quem Somos</Link>
            <Link to="/faq" className="text-gray-600 hover:text-gray-800">FAQ</Link>
            <Link to="/agency/login" className="text-gray-600 hover:text-gray-800">Portal da Agência</Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            <AuthButton />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-600 hover:text-gray-800">Início</Link>
            <Link to="/como-funciona" className="block px-3 py-2 text-gray-600 hover:text-gray-800">Como Funciona</Link>
            <Link to="/quem-somos" className="block px-3 py-2 text-gray-600 hover:text-gray-800">Quem Somos</Link>
            <Link to="/faq" className="block px-3 py-2 text-gray-600 hover:text-gray-800">FAQ</Link>
            <Link to="/agency/login" className="block px-3 py-2 text-gray-600 hover:text-gray-800">Portal da Agência</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
