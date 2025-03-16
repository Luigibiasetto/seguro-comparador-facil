
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
          {/* Hero Section with Beach Image and Gradient Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16 relative rounded-2xl overflow-hidden"
            style={{ 
              background: `linear-gradient(to right, rgba(209, 250, 229, 0.85) 0%, rgba(209, 250, 229, 0.4) 50%, transparent 100%), url('/lovable-uploads/7714c7bb-caff-486b-9549-646729e0ec8c.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              boxShadow: "0 4px 25px rgba(0, 0, 0, 0.1)" 
            }}
          >
            {/* Content over the gradient background */}
            <div className="flex flex-col items-center justify-center px-6 py-12 md:py-16">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-teal-800 mb-6 max-w-3xl leading-tight uppercase tracking-wider">
                ENCONTRE O SEGURO VIAGEM IDEAL PARA SUA PRÓXIMA AVENTURA
              </h1>
              
              {/* Move the API config button and info into the hero section */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsApiConfigOpen(true)}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white/30"
                >
                  <Settings className="w-4 h-4" />
                  Configurar API
                </Button>
                
                <div className="flex items-center text-sm text-gray-700 gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Seus dados estão protegidos</span>
                </div>
              </div>
              
              {/* Search Form moved inside the hero section */}
              <div className="w-full max-w-4xl mx-auto">
                <SearchForm />
              </div>
            </div>
          </motion.div>

          {/* Admin Link (discreto no canto inferior) */}
          <div className="text-right mb-4">
            <Link 
              to="/admin/login" 
              className="text-xs text-teal-600 hover:text-teal-800 transition-colors"
            >
              Acesso Administrativo
            </Link>
          </div>

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
