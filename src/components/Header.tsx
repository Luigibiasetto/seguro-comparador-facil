
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import AuthButton from "./AuthButton";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detecta o scroll para aplicar efeitos no header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 glass shadow-sm"
          : "py-4 bg-mint-green"
      }`}
      style={{ backgroundColor: isScrolled ? "" : "#DAF0E3" }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Menu de navegação - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <nav className="flex items-center space-x-1 mr-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-teal-50"
                  }`
                }
              >
                Início
              </NavLink>
              <NavLink
                to="/como-funciona"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-teal-50"
                  }`
                }
              >
                Como Funciona
              </NavLink>
              <NavLink
                to="/quem-somos"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-teal-50"
                  }`
                }
              >
                Sobre Nós
              </NavLink>
              <Button size="sm" className="ml-2 bg-teal-600 hover:bg-teal-700">
                <Phone className="h-3.5 w-3.5 mr-1.5" />
                Contato
              </Button>
            </nav>
            <AuthButton />
          </div>

          {/* Botão do menu mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <AuthButton />
            <button
              className="flex items-center text-gray-700"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 py-2 glass rounded-lg shadow-lg animate-slide-down">
            <div className="flex flex-col space-y-1 px-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-teal-50"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Início
              </NavLink>
              <NavLink
                to="/como-funciona"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-teal-50"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Como Funciona
              </NavLink>
              <NavLink
                to="/quem-somos"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-teal-50"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sobre Nós
              </NavLink>
              <Button
                size="sm"
                className="mt-2 bg-teal-600 hover:bg-teal-700"
              >
                <Phone className="h-3.5 w-3.5 mr-1.5" />
                Contato
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
