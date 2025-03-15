
import React from "react";
import { motion } from "framer-motion";
import { Users, Award, Shield, Globe, Calendar, HeartHandshake } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Quem Somos Nós
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Há mais de 12 anos ajudando viajantes a encontrar a proteção ideal para suas jornadas ao redor do mundo.
            </p>
          </motion.div>
          
          {/* Our Story Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">Nossa História</h2>
                <p className="text-gray-600 mb-4">
                  Fundada em 2012, a Comparado nasceu da visão de simplificar o processo de escolha de seguros de viagem, tornando-o mais acessível e transparente para todos os viajantes brasileiros.
                </p>
                <p className="text-gray-600 mb-4">
                  O que começou como uma pequena empresa de consultoria especializada em seguros de viagem, cresceu para se tornar uma das principais plataformas de comparação de seguros do Brasil, com parcerias com as maiores seguradoras do mercado.
                </p>
                <p className="text-gray-600">
                  Nossa missão permanece a mesma desde o primeiro dia: garantir que cada viajante encontre a proteção ideal para sua jornada, com transparência, facilidade e o melhor custo-benefício.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" 
                  alt="Nossa equipe trabalhando" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.section>
          
          {/* Our Values Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Nossos Valores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md bg-white transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-indigo-100 p-3 rounded-full mb-4">
                      <Shield className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Confiança</h3>
                    <p className="text-gray-600">
                      Construímos relacionamentos baseados na transparência e na honestidade com nossos clientes e parceiros.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-white transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-indigo-100 p-3 rounded-full mb-4">
                      <HeartHandshake className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Compromisso</h3>
                    <p className="text-gray-600">
                      Estamos comprometidos em oferecer o melhor serviço, colocando as necessidades dos nossos clientes em primeiro lugar.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-white transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-indigo-100 p-3 rounded-full mb-4">
                      <Globe className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Inovação</h3>
                    <p className="text-gray-600">
                      Buscamos constantemente novas formas de melhorar nossos serviços e simplificar a experiência de nossos usuários.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>
          
          {/* Experience Highlights */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16 bg-gray-50 py-12 px-6 rounded-xl"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Nossa Experiência</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-full inline-flex items-center justify-center mb-4 shadow-md">
                  <Calendar className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-indigo-600 mb-2">+12</h3>
                <p className="text-gray-700 font-medium">Anos de Experiência</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white p-4 rounded-full inline-flex items-center justify-center mb-4 shadow-md">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-indigo-600 mb-2">+500k</h3>
                <p className="text-gray-700 font-medium">Clientes Satisfeitos</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white p-4 rounded-full inline-flex items-center justify-center mb-4 shadow-md">
                  <Globe className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-indigo-600 mb-2">+120</h3>
                <p className="text-gray-700 font-medium">Países Cobertos</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white p-4 rounded-full inline-flex items-center justify-center mb-4 shadow-md">
                  <Award className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-indigo-600 mb-2">97%</h3>
                <p className="text-gray-700 font-medium">Taxa de Satisfação</p>
              </div>
            </div>
          </motion.section>
          
          {/* Team Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Nossa Equipe</h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
              Contamos com uma equipe de especialistas apaixonados por viagens e seguros, prontos para ajudar você a encontrar a melhor proteção para sua jornada.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Ana Oliveira - CEO" 
                    className="w-full h-auto"
                  />
                </div>
                <h3 className="text-xl font-medium text-gray-900">Ana Oliveira</h3>
                <p className="text-indigo-600 mb-2">CEO & Fundadora</p>
                <p className="text-gray-600 text-sm">
                  Mais de 15 anos de experiência em seguros e viagens internacionais.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Carlos Mendes - Diretor de Operações" 
                    className="w-full h-auto"
                  />
                </div>
                <h3 className="text-xl font-medium text-gray-900">Carlos Mendes</h3>
                <p className="text-indigo-600 mb-2">Diretor de Operações</p>
                <p className="text-gray-600 text-sm">
                  Especialista em parcerias estratégicas com seguradoras internacionais.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Mariana Santos - Gerente de Atendimento" 
                    className="w-full h-auto"
                  />
                </div>
                <h3 className="text-xl font-medium text-gray-900">Mariana Santos</h3>
                <p className="text-indigo-600 mb-2">Gerente de Atendimento</p>
                <p className="text-gray-600 text-sm">
                  Dedicada a garantir a melhor experiência para nossos clientes.
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
