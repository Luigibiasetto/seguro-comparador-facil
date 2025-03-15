
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Plane, CreditCard, Calendar, Globe, HeadphonesIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  // Categorized FAQ items
  const faqCategories = [
    {
      title: "Sobre Seguro Viagem",
      icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
      questions: [
        {
          question: "O que é seguro viagem?",
          answer: "Seguro viagem é um tipo de seguro que oferece proteção durante sua viagem, cobrindo despesas médicas, hospitalares, odontológicas, além de outros benefícios como assistência em caso de extravio de bagagem, atraso de voo, repatriação sanitária e atendimento 24 horas."
        },
        {
          question: "O seguro viagem é obrigatório?",
          answer: "Para alguns destinos, o seguro viagem é obrigatório. Países do Tratado de Schengen (Europa), Cuba e Emirados Árabes Unidos exigem seguro viagem com cobertura mínima específica. Mesmo para destinos onde não é obrigatório, é altamente recomendado para evitar gastos inesperados com saúde no exterior."
        },
        {
          question: "Qual é a diferença entre seguro viagem e assistência viagem?",
          answer: "O seguro viagem é regulamentado pela SUSEP e oferece indenizações mediante reembolso após o evento, enquanto a assistência viagem proporciona serviços de apoio ao viajante durante a viagem. Muitas apólices modernas combinam ambos os benefícios, oferecendo tanto serviços de assistência quanto indenizações quando necessário."
        }
      ]
    },
    {
      title: "Coberturas e Benefícios",
      icon: <Globe className="h-6 w-6 text-green-500" />,
      questions: [
        {
          question: "Quais são as principais coberturas de um seguro viagem?",
          answer: "As principais coberturas incluem: despesas médicas e hospitalares, despesas odontológicas, assistência farmacêutica, seguro de bagagem (extravio, roubo e danos), regresso sanitário, traslado médico, assistência jurídica, repatriação funerária, seguro de invalidez por acidente, e indenização por cancelamento de viagem."
        },
        {
          question: "O seguro viagem cobre COVID-19?",
          answer: "Sim, a maioria dos planos disponíveis em nossa plataforma oferece cobertura para COVID-19, incluindo despesas médicas, hospitalares e medicamentos. Alguns planos também cobrem extensão de estadia em caso de quarentena obrigatória. É importante verificar as condições específicas de cada plano antes da contratação."
        },
        {
          question: "O que não é coberto pelo seguro viagem?",
          answer: "Geralmente, os seguros viagem não cobrem: doenças pré-existentes (salvo alguns planos específicos), tratamentos estéticos, check-ups médicos de rotina, esportes radicais (a menos que contrate cobertura específica), eventos relacionados ao uso de álcool ou drogas ilícitas, danos intencionais ou lesões autoinfligidas, e viagens a regiões em guerra ou com alerta oficial de não-viagem."
        }
      ]
    },
    {
      title: "Contratação e Utilização",
      icon: <CreditCard className="h-6 w-6 text-green-500" />,
      questions: [
        {
          question: "Quando devo contratar o seguro viagem?",
          answer: "Recomendamos contratar o seguro viagem assim que você confirmar sua viagem. Isso garante que você esteja coberto em caso de cancelamento antes da partida. No entanto, você pode contratar até mesmo no dia da viagem se necessário."
        },
        {
          question: "Como funciona o seguro viagem em caso de emergência?",
          answer: "Em caso de emergência, entre em contato imediatamente com a central de atendimento 24h da seguradora (o número estará na sua apólice). A central vai orientá-lo sobre como proceder, indicando hospitais da rede credenciada ou autorizando atendimentos. Em alguns casos, a seguradora faz o pagamento direto ao prestador de serviço; em outros, você precisará pagar e solicitar reembolso."
        },
        {
          question: "Posso prorrogar meu seguro se decidir estender minha viagem?",
          answer: "Sim, na maioria dos casos é possível prorrogar seu seguro viagem se você decidir estender sua estadia. Entre em contato com a seguradora ou conosco antes do vencimento da sua apólice para verificar as condições de extensão. Algumas seguradoras permitem fazer isso diretamente pelo site ou aplicativo."
        }
      ]
    },
    {
      title: "Viagens Internacionais",
      icon: <Plane className="h-6 w-6 text-green-500" />,
      questions: [
        {
          question: "Qual a cobertura mínima para viajar para a Europa (Tratado de Schengen)?",
          answer: "Para países do Tratado de Schengen (maioria dos países da Europa), o seguro viagem deve ter cobertura mínima de € 30.000 (trinta mil euros) para despesas médicas e hospitalares. Recomendamos contratar coberturas superiores para maior tranquilidade, especialmente para estadias mais longas."
        },
        {
          question: "Preciso contratar seguro viagem para os Estados Unidos?",
          answer: "Embora não seja obrigatório, o seguro viagem para os Estados Unidos é altamente recomendado devido ao alto custo dos serviços médicos no país. Uma simples consulta médica pode custar centenas de dólares e uma internação hospitalar pode facilmente ultrapassar dezenas de milhares de dólares. Recomendamos coberturas a partir de US$ 100.000."
        },
        {
          question: "O seguro viagem internacional cobre deportação?",
          answer: "Não, os seguros viagem geralmente não cobrem despesas relacionadas à deportação ou negação de entrada em um país. Essas situações estão relacionadas a questões de imigração e não são consideradas emergências cobertas pelo seguro."
        }
      ]
    },
    {
      title: "Reembolsos e Reclamações",
      icon: <Calendar className="h-6 w-6 text-green-500" />,
      questions: [
        {
          question: "Como solicitar reembolso do seguro viagem?",
          answer: "Para solicitar reembolso, siga estes passos: 1) Informe a seguradora assim que o evento ocorrer; 2) Reúna todos os documentos necessários (comprovantes de pagamento, relatórios médicos, boletins de ocorrência, etc.); 3) Preencha o formulário de sinistro fornecido pela seguradora; 4) Envie toda a documentação pelos canais indicados (geralmente por e-mail ou pelo aplicativo). O prazo de análise e pagamento varia conforme a seguradora, geralmente entre 10 e 30 dias úteis."
        },
        {
          question: "Posso cancelar meu seguro viagem? Tenho direito a reembolso?",
          answer: "Sim, você pode cancelar seu seguro viagem. Se o cancelamento for solicitado em até 7 dias após a contratação (período de arrependimento), você tem direito ao reembolso integral. Após esse período, as condições variam conforme a seguradora e o plano contratado. Algumas cobram multa ou fazem reembolso proporcional ao período não utilizado."
        },
        {
          question: "O que fazer se a seguradora negar meu pedido de reembolso?",
          answer: "Se seu pedido de reembolso for negado, verifique o motivo na resposta da seguradora. Se você acreditar que tem direito ao reembolso, reúna documentos adicionais que possam apoiar seu caso e entre em contato novamente com a seguradora. Se o problema persistir, você pode registrar uma reclamação no SAC, na ouvidoria da seguradora, na SUSEP ou em órgãos de defesa do consumidor como o Procon."
        }
      ]
    },
    {
      title: "Nossos Serviços",
      icon: <HeadphonesIcon className="h-6 w-6 text-green-500" />,
      questions: [
        {
          question: "Como funciona o serviço de comparação do Comparado?",
          answer: "Nosso serviço funciona de forma simples: 1) Você informa seus dados de viagem (destino, datas, número de viajantes); 2) Nosso sistema consulta automaticamente os planos disponíveis em diversas seguradoras parceiras; 3) Apresentamos todas as opções com detalhes de coberturas e preços para que você possa comparar facilmente; 4) Após escolher, você finaliza a contratação diretamente em nossa plataforma e recebe sua apólice por e-mail em minutos."
        },
        {
          question: "Os preços no Comparado são os mesmos do site das seguradoras?",
          answer: "Sim, garantimos que os preços em nossa plataforma são os mesmos praticados diretamente pelas seguradoras. Em muitos casos, conseguimos oferecer descontos exclusivos graças às nossas parcerias. Nossa receita vem de comissões pagas pelas seguradoras, sem custo adicional para você."
        },
        {
          question: "Como entrar em contato com o suporte do Comparado?",
          answer: "Você pode entrar em contato com nosso suporte por vários canais: telefone (0800 123 4567), e-mail (contato@comparado.com.br), chat online disponível em nosso site, ou através de nossas redes sociais. Nossa equipe está disponível de segunda a sexta, das 8h às 20h, e aos sábados, das 9h às 15h."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tire suas dúvidas sobre seguro viagem e saiba como nossa plataforma pode ajudar você a encontrar a proteção ideal para sua próxima aventura.
            </p>
          </motion.div>
          
          {/* Search functionality could be added here in the future */}
          
          {/* FAQ Categories */}
          <div className="space-y-12 max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <motion.section 
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
              >
                <div className="flex items-center mb-6">
                  {category.icon}
                  <h2 className="text-2xl font-semibold text-gray-900 ml-3">
                    {category.title}
                  </h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, questionIndex) => (
                    <AccordionItem key={questionIndex} value={`item-${categoryIndex}-${questionIndex}`}>
                      <AccordionTrigger className="text-left font-medium text-gray-800 hover:text-indigo-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.section>
            ))}
          </div>
          
          {/* Still Have Questions Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-indigo-50 rounded-xl p-8 mt-16 text-center max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-600 mb-6">
              Nossa equipe de atendimento está pronta para ajudar você com qualquer dúvida sobre seguro viagem ou nossa plataforma.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="mailto:contato@comparado.com.br" className="flex items-center justify-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                contato@comparado.com.br
              </a>
              <a href="tel:08001234567" className="flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                0800 123 4567
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
