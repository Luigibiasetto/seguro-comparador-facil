
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="pt-16 pb-8 px-4 border-t border-gray-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-gray-600 text-sm mt-2">
              Comparamos os melhores seguros de viagem para você economizar tempo e dinheiro.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-gray-600 hover:text-indigo-600 transition-colors">Como Funciona</Link>
              </li>
              <li>
                <Link to="/quem-somos" className="text-gray-600 hover:text-indigo-600 transition-colors">Quem Somos</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-indigo-600 transition-colors">Perguntas Frequentes</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-indigo-600 transition-colors">Perguntas Frequentes</Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-gray-600 hover:text-indigo-600 transition-colors">Política de Privacidade</Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-600 hover:text-indigo-600 transition-colors">Termos de Uso</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Phone className="h-4 w-4 mr-2 text-indigo-600 mt-0.5" />
                <span className="text-gray-600">0800 123 4567</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-4 w-4 mr-2 text-indigo-600 mt-0.5" />
                <span className="text-gray-600">contato@comparado.com.br</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-100">
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Comparado. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
