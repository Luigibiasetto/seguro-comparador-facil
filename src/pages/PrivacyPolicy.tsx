
import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
            
            <div className="space-y-6 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introdução</h2>
                <p>
                  A Comparado valoriza sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos suas informações ao utilizar nossos serviços.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Dados que Coletamos</h2>
                <p>
                  Podemos coletar os seguintes tipos de informações:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Informações de identificação:</strong> nome, e-mail, telefone, CPF;</li>
                  <li><strong>Informações de viagem:</strong> destinos, datas, número de viajantes;</li>
                  <li><strong>Informações de pagamento:</strong> dados necessários para processar transações;</li>
                  <li><strong>Dados de navegação:</strong> endereço IP, cookies, tipo de navegador;</li>
                  <li><strong>Comunicações:</strong> registros de mensagens trocadas com nossa equipe.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Como Usamos Seus Dados</h2>
                <p>
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Fornecer cotações de seguros viagem personalizadas;</li>
                  <li>Processar a contratação de apólices;</li>
                  <li>Enviar confirmações e informações sobre sua apólice;</li>
                  <li>Oferecer suporte ao cliente;</li>
                  <li>Melhorar nossos serviços e desenvolver novos recursos;</li>
                  <li>Prevenir fraudes e garantir a segurança da plataforma;</li>
                  <li>Enviar comunicações de marketing (caso você tenha consentido).</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Compartilhamento de Dados</h2>
                <p>
                  Podemos compartilhar suas informações com:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Seguradoras parceiras:</strong> para fornecer cotações e processar a contratação de apólices;</li>
                  <li><strong>Processadores de pagamento:</strong> para processar transações financeiras;</li>
                  <li><strong>Prestadores de serviços:</strong> empresas que nos auxiliam em operações técnicas e de suporte;</li>
                  <li><strong>Autoridades competentes:</strong> quando exigido por lei ou para proteger nossos direitos.</li>
                </ul>
                <p className="mt-2">
                  Não vendemos seus dados pessoais a terceiros.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Proteção de Dados</h2>
                <p>
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Essas medidas incluem criptografia, firewalls, controles de acesso e auditorias regulares.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Cookies e Tecnologias Semelhantes</h2>
                <p>
                  Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, lembrar suas preferências e coletar informações sobre como você utiliza nossa plataforma. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Seus Direitos</h2>
                <p>
                  De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Acessar seus dados pessoais;</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                  <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
                  <li>Revogar o consentimento a qualquer momento;</li>
                  <li>Solicitar a exclusão de seus dados pessoais.</li>
                </ul>
                <p className="mt-2">
                  Para exercer seus direitos, entre em contato conosco através dos canais indicados ao final desta política.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Retenção de Dados</h2>
                <p>
                  Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados, incluindo obrigações legais, contratuais, prestação de contas ou solicitação de autoridades competentes.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Alterações nesta Política</h2>
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre disponível em nosso site. Recomendamos que você revise esta política regularmente.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Contato</h2>
                <p>
                  Se você tiver dúvidas, preocupações ou solicitações relacionadas à sua privacidade, entre em contato com nosso Encarregado de Proteção de Dados:
                </p>
                <div className="mt-2">
                  <p><strong>E-mail:</strong> privacidade@comparado.com.br</p>
                  <p><strong>Telefone:</strong> 0800 123 4567</p>
                </div>
              </section>
              
              <section className="pt-4 border-t border-gray-200">
                <p className="text-sm">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
