
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCountry } from "@/lib/countries";

interface SearchSummaryProps {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date;
  passengers: any;
}

const SearchSummary = ({
  origin,
  destination,
  departureDate,
  returnDate,
  passengers
}: SearchSummaryProps) => {
  const getOriginLabel = () => {
    switch (origin) {
      case "brasil":
        return "Brasil";
      case "estrangeiro-brasil":
        return "Estrangeiro vindo ao Brasil";
      default:
        return formatCountry(origin);
    }
  };

  const getDestinationLabel = () => {
    if (origin === "estrangeiro-brasil") {
      return "Continente de Origem";
    } else {
      return "Destino";
    }
  };

  const formatDestination = () => {
    // Mapeamento dos continentes
    const continentMap: Record<string, string> = {
      'america-norte': 'América do Norte',
      'america-sul': 'América do Sul',
      'europa': 'Europa',
      'asia': 'Ásia',
      'africa': 'África',
      'oceania': 'Oceania'
    };

    // Verifica se o destino é um continente
    if (continentMap[destination]) {
      return continentMap[destination];
    }
    
    // Caso não seja um continente, usa o formatador de país
    return formatCountry(destination);
  };

  return (
    <div className="p-4 bg-muted rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-2">Resumo da busca</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Origem</div>
          <div className="font-medium">{getOriginLabel()}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{getDestinationLabel()}</div>
          <div className="font-medium">{formatDestination()}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Data de ida</div>
          <div className="font-medium">
            {format(departureDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Data de volta</div>
          <div className="font-medium">
            {format(returnDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Passageiros</div>
          <div className="font-medium">{passengers.count}</div>
        </div>
      </div>
    </div>
  );
};

export default SearchSummary;
