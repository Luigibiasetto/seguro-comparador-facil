
import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfUse = () => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
            
            <div className="space-y-6 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e utilizar a plataforma Comparado, você concorda com estes Termos de Uso e com nossa Política de Privacidade. Se você não concordar com qualquer parte destes termos, por favor, não utilize nossos serviços.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Descrição do Serviço</h2>
                <p>
                  O Comparado é uma plataforma de comparação de seguros de viagem que permite aos usuários pesquisar, comparar e contratar apólices de seguro viagem de diversas seguradoras parceiras. Atuamos como intermediários entre você e as seguradoras, fornecendo informações sobre os produtos disponíveis.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Cadastro e Conta</h2>
                <p>
                  Para utilizar alguns recursos do Comparado, pode ser necessário criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrerem em sua conta. Comprometemo-nos a proteger seus dados pessoais de acordo com nossa Política de Privacidade.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Uso do Serviço</h2>
                <p>
                  Ao utilizar nossos serviços, você concorda em:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Fornecer informações precisas e completas durante o processo de cotação e contratação;</li>
                  <li>Utilizar a plataforma apenas para fins legais e legítimos;</li>
                  <li>Não tentar acessar áreas restritas do site ou tentar burlar mecanismos de segurança;</li>
                  <li>Não utilizar a plataforma para disseminar malware, vírus ou realizar atividades fraudulentas.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Contratação de Seguros</h2>
                <p>
                  Ao contratar um seguro através do Comparado, você está estabelecendo uma relação contratual diretamente com a seguradora escolhida. Somos apenas intermediários nesse processo. Os termos e condições específicos da apólice são determinados pela seguradora e devem ser lidos cuidadosamente antes da contratação.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Pagamentos</h2>
                <p>
                  Os pagamentos realizados através da plataforma são processados por gateways de pagamento seguros. Não armazenamos dados completos de cartões de crédito. Todas as transações são protegidas por criptografia avançada para garantir sua segurança.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Propriedade Intelectual</h2>
                <p>
                  Todo o conteúdo disponibilizado no Comparado, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade do Comparado ou de seus fornecedores de conteúdo e está protegido pelas leis de propriedade intelectual aplicáveis.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Limitação de Responsabilidade</h2>
                <p>
                  O Comparado se esforça para fornecer informações precisas e atualizadas, mas não garantimos a exatidão, integridade ou atualidade de todas as informações disponibilizadas. Não nos responsabilizamos por quaisquer erros ou omissões, nem por quaisquer danos decorrentes do uso da plataforma.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Alterações nos Termos</h2>
                <p>
                  Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação na plataforma. O uso continuado do Comparado após tais alterações implica em sua aceitação dos novos termos.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Lei Aplicável</h2>
                <p>
                  Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa relacionada aos serviços oferecidos pelo Comparado será submetida à jurisdição dos tribunais brasileiros.
                </p>
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

export default TermsOfUse;
