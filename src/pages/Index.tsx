
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Compass, Clock, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-brand-600" />,
      title: "Coberturas Completas",
      description:
        "Compare e escolha seguros com coberturas para despesas médicas, cancelamento, bagagem e mais.",
    },
    {
      icon: <Compass className="h-6 w-6 text-brand-600" />,
      title: "Destinos Mundiais",
      description:
        "Seguros para qualquer país, com opções específicas para cada região e tipo de viagem.",
    },
    {
      icon: <Clock className="h-6 w-6 text-brand-600" />,
      title: "Cotação Instantânea",
      description:
        "Receba cotações de várias seguradoras em segundos, sem burocracia.",
    },
  ];

  const benefits = [
    "Atendimento 24h em português",
    "Cobertura para COVID-19",
    "Reembolso rápido",
    "Desconto para famílias",
    "Assistência completa em viagem",
    "Emissão imediata da apólice",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-24 md:pt-32 pb-16 md:pb-24 px-4"
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="text-center mb-8 md:mb-12"
          >
            <motion.div variants={itemVariants} className="inline-block">
              <span className="bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full">
                Compare e economize até 40%
              </span>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mt-4 mb-4 leading-tight"
            >
              Seguro Viagem para{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">
                Qualquer Destino
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto"
            >
              Compare os melhores seguros de viagem em um só lugar.
              Encontre a proteção ideal para sua jornada em poucos cliques.
            </motion.p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SearchForm className="max-w-4xl mx-auto" />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Por que escolher o SeguroJá?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A maneira mais simples de encontrar e comparar seguros de viagem que atendam às suas necessidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Viaje com tranquilidade, aproveite cada momento
                </h2>
                <p className="text-brand-100 mb-8">
                  Tenha a segurança que você precisa, para qualquer imprevisto que possa surgir durante sua viagem.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2"
                    >
                      <div className="flex-shrink-0 w-5 h-5 bg-white rounded-full flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-brand-600" />
                      </div>
                      <span className="text-white text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="hidden lg:block bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80')] bg-cover bg-center">
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Seguradoras Parceiras
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trabalhamos com as melhores seguradoras do mercado para oferecer a você as melhores opções.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white h-20 rounded-lg flex items-center justify-center p-4 border border-gray-100"
              >
                <div className="w-full h-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 text-sm text-gray-500">
            * As seguradoras serão integradas via API
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para começar sua viagem com segurança?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Compare as melhores opções de seguro viagem e escolha a que melhor se adapta às suas necessidades.
            </p>
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors duration-200"
            >
              Comparar Seguros Agora
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
