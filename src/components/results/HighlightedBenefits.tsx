
import { CheckCircle, Phone, Clock, FileSearch, CreditCard } from "lucide-react";

const HighlightedBenefits = () => {
  const benefits = [
    {
      title: "Cobertura COVID-19",
      description: "Oferecemos planos com cobertura para COVID-19",
      icon: <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
    },
    {
      title: "Atendimento 24h",
      description: "Suporte em português 24 horas por dia",
      icon: <Phone className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
    },
    {
      title: "Comparação instantânea",
      description: "Compare as melhores seguradoras em um só lugar",
      icon: <FileSearch className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
    },
    {
      title: "Melhor preço",
      description: "Garantimos o melhor preço do mercado",
      icon: <CreditCard className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Por que contratar com a Comparado?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start">
            {benefit.icon}
            <div>
              <h4 className="font-medium text-sm">{benefit.title}</h4>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighlightedBenefits;
