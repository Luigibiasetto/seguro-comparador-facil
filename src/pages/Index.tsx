
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, User, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApiConfigModal from "@/components/ApiConfigModal";
import SearchForm from "@/components/SearchForm";
import CustomerReviews from "@/components/CustomerReviews";
import { Link } from "react-router-dom";

const Index = () => {
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-7xl">
          {/* Hero com Imagem de Fundo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16 relative rounded-2xl overflow-hidden"
            style={{ 
              height: "380px",
              boxShadow: "0 4px 25px rgba(0, 0, 0, 0.1)" 
            }}
          >
            {/* Imagem de fundo */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3000&q=80')",
                filter: "brightness(0.7)"
              }}
            ></div>
            
            {/* Overlay de gradiente para melhorar a legibilidade do texto */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ 
                background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)" 
              }}
            ></div>
            
            {/* Conteúdo sobre a imagem */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl leading-tight">
                Encontre o Seguro Viagem Ideal para sua Próxima Aventura
              </h1>
              <p className="text-lg text-white mb-6 max-w-2xl">
                Compare as melhores opções de seguro viagem e viaje com tranquilidade.
              </p>
            </div>
          </motion.div>
          
          <div className="mt-6 flex flex-wrap gap-3 justify-center mb-12">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsApiConfigOpen(true)}
              className="flex items-center gap-2 border-teal-700 text-teal-700 hover:bg-teal-50"
            >
              <Settings className="w-4 h-4" />
              Configurar API
            </Button>
            
            <div className="flex items-center text-sm text-green-500 gap-1">
              <Shield className="w-4 h-4" />
              <span>Seus dados estão protegidos</span>
            </div>
          </div>

          {/* Admin Link (discreto no canto inferior) */}
          <div className="text-right mb-4">
            <Link 
              to="/admin/login" 
              className="text-xs text-teal-600 hover:text-teal-800 transition-colors"
            >
              Acesso Administrativo
            </Link>
          </div>

          {/* Search Form with Gradient Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-xl p-1" 
            style={{ 
              background: "linear-gradient(180deg, rgba(220, 252, 231, 0.6) 0%, #FFFFFF 100%)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)" 
            }}
          >
            <SearchForm />
          </motion.div>

          {/* Why Choose Us Section */}
          <section className="mt-12 md:mt-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-3xl font-semibold text-gray-900 mb-6 text-center"
            >
              Por que Escolher Nosso Comparador de Seguros?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center"
              >
                <MapPin className="mx-auto h-10 w-10 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Ampla Cobertura Geográfica
                </h3>
                <p className="text-gray-600">
                  Encontre seguros que cobrem você em qualquer lugar do mundo.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center"
              >
                <CalendarDays className="mx-auto h-10 w-10 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Flexibilidade de Datas
                </h3>
                <p className="text-gray-600">
                  Selecione as datas exatas da sua viagem para uma cobertura precisa.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-center"
              >
                <Shield className="mx-auto h-10 w-10 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Segurança de Dados
                </h3>
                <p className="text-gray-600">
                  Seus dados pessoais são criptografados e protegidos com os mais altos padrões de segurança.
                </p>
              </motion.div>
            </div>
          </section>
        </div>
        
        {/* Customer Reviews Section */}
        <CustomerReviews />
      </main>
      
      <Footer />
      
      <ApiConfigModal 
        open={isApiConfigOpen} 
        onOpenChange={setIsApiConfigOpen} 
      />
    </div>
  );
};

export default Index;
