
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FrequentlyAskedQuestions = () => {
  const faqs = [
    {
      question: "O que é seguro viagem?",
      answer: "Seguro viagem é um tipo de seguro que cobre despesas médicas, hospitalares e odontológicas durante sua viagem, além de outros benefícios como extravio de bagagem, atraso de voo e assistência 24h."
    },
    {
      question: "O seguro viagem é obrigatório?",
      answer: "Para alguns destinos como Europa (Tratado de Schengen), Cuba e Emirados Árabes, o seguro viagem é obrigatório. Para outros destinos, embora não seja obrigatório, é altamente recomendado para evitar altos custos com saúde no exterior."
    },
    {
      question: "Quando devo contratar o seguro viagem?",
      answer: "Recomendamos contratar o seguro viagem assim que você comprar suas passagens, pois além de garantir melhores preços, você já estará coberto em caso de cancelamento de viagem."
    },
    {
      question: "O seguro viagem cobre COVID-19?",
      answer: "Sim, a maioria dos nossos planos oferecem cobertura para COVID-19, incluindo despesas médicas e hospitalares, além de extensão de estadia se necessário."
    },
    {
      question: "Como funciona o seguro viagem em caso de emergência?",
      answer: "Em caso de emergência, você deve entrar em contato com a central de atendimento 24h da seguradora, que irá orientá-lo sobre os próximos passos e autorizações necessárias."
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-xl font-semibold mb-4">Perguntas Frequentes</h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FrequentlyAskedQuestions;
