
import React from "react";
import { motion } from "framer-motion";
import { Search, ListChecks, CreditCard, CheckCircle, Globe, Shield, Clock, HeadphonesIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HowItWorks = () => {
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
              Como Funciona
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Encontrar o seguro viagem ideal nunca foi tão simples. Veja como nossa plataforma facilita a busca pela melhor proteção para sua viagem.
            </p>
          </motion.div>
          
          {/* Step by Step Process */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
              Processo Simplificado em 4 Passos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <Search className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">Preencha o Formulário</h3>
                    <p className="text-gray-600">
                      Informe seu destino, datas da viagem e quantidade de viajantes para iniciar a busca.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 2 */}
              <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <ListChecks className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">Compare as Opções</h3>
                    <p className="text-gray-600">
                      Analise as diferentes coberturas, benefícios e preços das seguradoras parceiras.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 3 */}
              <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <CheckCircle className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">Escolha o Melhor Plano</h3>
                    <p className="text-gray-600">
                      Selecione o seguro que melhor atende às suas necessidades e ao seu orçamento.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 4 */}
              <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <CreditCard className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                      4
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">Finalize a Compra</h3>
                    <p className="text-gray-600">
                      Realize o pagamento de forma segura e receba sua apólice por e-mail em minutos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-10">
              <Link to="/">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </motion.section>
          
          {/* Benefits Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16 bg-gray-50 py-12 px-6 rounded-xl"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
              Benefícios do Nosso Serviço
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Cobertura Internacional</h3>
                  <p className="text-gray-600">
                    Oferecemos seguros com cobertura em mais de 150 países, garantindo sua proteção em qualquer destino.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Seguradoras Confiáveis</h3>
                  <p className="text-gray-600">
                    Trabalhamos apenas com as principais seguradoras do mercado, garantindo qualidade e confiabilidade.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Processo Rápido</h3>
                  <p className="text-gray-600">
                    Em menos de 5 minutos, você encontra, compara e contrata o seguro ideal para sua viagem.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <HeadphonesIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Suporte 24/7</h3>
                  <p className="text-gray-600">
                    Nossa equipe está disponível 24 horas por dia, 7 dias por semana, para ajudar em qualquer emergência.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Pagamento Seguro</h3>
                  <p className="text-gray-600">
                    Utilizamos criptografia de ponta para garantir a segurança dos seus dados de pagamento.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <Search className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Comparação Transparente</h3>
                  <p className="text-gray-600">
                    Exibimos todas as informações relevantes para que você possa fazer uma escolha informada.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* FAQ Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
              Perguntas Frequentes
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    Por que devo contratar um seguro viagem?
                  </AccordionTrigger>
                  <AccordionContent>
                    O seguro viagem é essencial para proteger você contra imprevistos durante sua viagem, como despesas médicas, cancelamentos, extravio de bagagem e outros problemas que podem ocorrer. Em muitos países, como os da União Europeia, o seguro viagem é obrigatório para a entrada de turistas.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    Quanto tempo antes da viagem devo contratar o seguro?
                  </AccordionTrigger>
                  <AccordionContent>
                    Recomendamos contratar o seguro viagem assim que você confirmar sua viagem. Isso garante que você esteja protegido contra possíveis cancelamentos e imprevistos antes mesmo de embarcar. No entanto, você pode contratar o seguro até mesmo no dia da viagem, se necessário.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    O que acontece se eu precisar usar o seguro durante a viagem?
                  </AccordionTrigger>
                  <AccordionContent>
                    Em caso de emergência, você deve entrar em contato com a central de atendimento da seguradora, cujo número estará disponível em sua apólice. Dependendo da situação, a seguradora pode oferecer atendimento direto ou reembolso das despesas. É importante guardar todos os comprovantes e documentos relacionados ao ocorrido.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    O seguro viagem cobre COVID-19?
                  </AccordionTrigger>
                  <AccordionContent>
                    Muitas seguradoras já incluem cobertura para COVID-19 em seus planos. No entanto, as condições e limites podem variar. Em nossa plataforma, você pode facilmente identificar quais seguros oferecem cobertura específica para COVID-19 e quais são os valores de cobertura oferecidos.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    Posso cancelar meu seguro viagem?
                  </AccordionTrigger>
                  <AccordionContent>
                    Sim, você pode cancelar seu seguro viagem. A maioria das seguradoras oferece um período de arrependimento de até 7 dias após a contratação, com devolução integral do valor pago. Após esse período, as condições de cancelamento variam conforme a política de cada seguradora.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.section>
          
          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center bg-indigo-50 py-12 px-6 rounded-xl"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Pronto para viajar com tranquilidade?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Compare agora mesmo os melhores seguros viagem do mercado e escolha a proteção ideal para sua próxima aventura.
            </p>
            <Link to="/">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Comparar Seguros Agora
              </Button>
            </Link>
          </motion.section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
