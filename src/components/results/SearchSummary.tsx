
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
        return "Brasileiro indo ao exterior";
      case "estrangeiro":
        return "Estrangeiro";
      case "estrangeiro-brasil":
        return "Estrangeiro vindo ao Brasil";
      default:
        return formatCountry(origin);
    }
  };

  const getDestinationLabel = () => {
    if (origin === "estrangeiro-brasil") {
      return "País de Origem";
    } else {
      return "Destino";
    }
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
          <div className="font-medium">{formatCountry(destination)}</div>
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
