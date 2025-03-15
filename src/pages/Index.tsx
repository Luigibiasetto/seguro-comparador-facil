
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, User, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApiConfigModal from "@/components/ApiConfigModal";
import SearchForm from "@/components/SearchForm";
import CustomerReviews from "@/components/CustomerReviews";
import { secureStore, secureRetrieve } from "@/services/security/dataSecurity";

const Index = () => {
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState<boolean>(false);

  // Check if user has previously accepted privacy terms
  useEffect(() => {
    const privacyAccepted = secureRetrieve<boolean>("privacy-accepted");
    if (privacyAccepted) {
      setHasAcceptedPrivacy(true);
    }
  }, []);

  const handleAcceptPrivacy = () => {
    secureStore("privacy-accepted", true);
    setHasAcceptedPrivacy(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-7xl">
          {/* Hero Header */}
          <div className="text-center mb-8 md:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            >
              Encontre o Seguro Viagem Ideal para sua Próxima Aventura
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-6 md:mb-8"
            >
              Compare as melhores opções de seguro viagem e viaje com tranquilidade.
            </motion.p>
            
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsApiConfigOpen(true)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configurar API
              </Button>
              
              <div className="flex items-center text-sm text-green-600 gap-1">
                <Shield className="w-4 h-4" />
                <span>Seus dados estão protegidos</span>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          {!hasAcceptedPrivacy && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-indigo-50 p-4 rounded-lg mb-8 text-center"
            >
              <p className="text-sm text-gray-700 mb-2">
                Valorizamos sua privacidade. Seus dados são criptografados e armazenados com segurança.
              </p>
              <Button size="sm" onClick={handleAcceptPrivacy}>
                Entendi e Aceito
              </Button>
            </motion.div>
          )}

          {/* Search Form with Gradient Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-xl p-1" 
            style={{ 
              background: "linear-gradient(180deg, #F2FCE2 0%, #FFFFFF 100%)",
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
