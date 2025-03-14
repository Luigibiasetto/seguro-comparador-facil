import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Calendar, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import CountrySelect from "./CountrySelect";
import PassengerSelect from "./PassengerSelect";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type OriginType = "brasil" | "estrangeiro-brasil";

interface SearchFormProps {
  className?: string;
  defaultExpanded?: boolean;
}

const SearchForm = ({ className = "", defaultExpanded = true }: SearchFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados do formulário
  const [origin, setOrigin] = useState<OriginType>("brasil");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Data atual + 7 dias
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Data atual + 14 dias
  );
  const [passengers, setPassengers] = useState({
    count: 1,
    ages: [30],
  });
  const [phone, setPhone] = useState("");
  
  // Estados da UI
  const [isDepartureFocused, setIsDepartureFocused] = useState(false);
  const [isReturnFocused, setIsReturnFocused] = useState(false);

  // Validações básicas
  const isValidForm = () => {
    if (!destination) {
      toast({
        title: "Destino necessário",
        description: "Por favor, selecione o país de destino.",
        variant: "destructive",
      });
      return false;
    }

    if (!departureDate) {
      toast({
        title: "Data de ida necessária",
        description: "Por favor, selecione a data de ida.",
        variant: "destructive",
      });
      return false;
    }

    if (!returnDate) {
      toast({
        title: "Data de volta necessária",
        description: "Por favor, selecione a data de volta.",
        variant: "destructive",
      });
      return false;
    }

    if (departureDate && returnDate && departureDate > returnDate) {
      toast({
        title: "Datas inválidas",
        description: "A data de ida não pode ser posterior à data de volta.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Formatação de telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    let formatted = numbers;
    
    if (numbers.length <= 2) {
      formatted = numbers;
    } else if (numbers.length <= 6) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
  };

  // Manipulador de envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidForm()) return;
    
    // Construir a URL de pesquisa
    const searchParams = new URLSearchParams();
    searchParams.append("origin", origin);
    searchParams.append("destination", destination);
    searchParams.append("departureDate", departureDate?.toISOString() || "");
    searchParams.append("returnDate", returnDate?.toISOString() || "");
    searchParams.append("passengers", JSON.stringify(passengers));
    if (phone) searchParams.append("phone", phone);
    
    // Navegar para a página de resultados
    navigate(`/resultados?${searchParams.toString()}`);
  };

  // Format the passenger information for display
  const formatPassengerInfo = () => {
    const { count, ages } = passengers;
    const passengersText = count === 1 ? 'passageiro' : 'passageiros';
    const agesText = ages.map(age => `${age} anos`).join(', ');
    return `${count} ${passengersText} (${agesText})`;
  };

  // Gerar o rótulo do destino com base na origem
  const getDestinationLabel = () => {
    if (origin === "estrangeiro-brasil") {
      return "País de Origem";
    } else {
      return "Destino";
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="glass rounded-xl p-4 md:p-6 shadow-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Seleção de Origem */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origem
            </label>
            <RadioGroup
              value={origin}
              onValueChange={(value) => setOrigin(value as OriginType)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="brasil" id="option-brasil" />
                <Label htmlFor="option-brasil">Brasil</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="estrangeiro-brasil" id="option-estrangeiro-brasil" />
                <Label htmlFor="option-estrangeiro-brasil">Estrangeiro vindo ao Brasil</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Seleção de Destino */}
          <CountrySelect
            value={destination}
            onChange={setDestination}
            label={getDestinationLabel()}
            placeholder={origin === "estrangeiro-brasil" ? "De onde você vem?" : "Para onde você vai?"}
            excludedCountry={origin === "brasil" ? "BR" : (origin === "estrangeiro-brasil" ? undefined : "BR")}
          />

          {/* Datas */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-3">
            {/* Data de Ida */}
            <Popover
              open={isDepartureFocused}
              onOpenChange={setIsDepartureFocused}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Data de Ida
                </label>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "input-glass w-full flex items-center px-3 py-2.5 rounded-lg text-left",
                      !departureDate && "text-gray-400",
                      isDepartureFocused && "ring-1 ring-brand-400"
                    )}
                  >
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    {departureDate ? (
                      <span>
                        {format(departureDate, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    ) : (
                      <span>Selecione</span>
                    )}
                  </button>
                </PopoverTrigger>
              </div>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  disabled={(date) => date < new Date(Date.now() - 24 * 60 * 60 * 1000)}
                  initialFocus
                  locale={ptBR}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* Data de Volta */}
            <Popover
              open={isReturnFocused}
              onOpenChange={setIsReturnFocused}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Data de Volta
                </label>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "input-glass w-full flex items-center px-3 py-2.5 rounded-lg text-left",
                      !returnDate && "text-gray-400",
                      isReturnFocused && "ring-1 ring-brand-400"
                    )}
                  >
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    {returnDate ? (
                      <span>
                        {format(returnDate, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    ) : (
                      <span>Selecione</span>
                    )}
                  </button>
                </PopoverTrigger>
              </div>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) => 
                    date < new Date(Date.now() - 24 * 60 * 60 * 1000) || 
                    (departureDate && date < departureDate)
                  }
                  initialFocus
                  locale={ptBR}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Passageiros com informação de idade */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Passageiros e Idades
            </label>
            <PassengerSelect
              value={passengers}
              onChange={setPassengers}
              label=""
            />
            <div className="mt-1 text-xs text-gray-500">
              {formatPassengerInfo()}
            </div>
          </div>

          {/* Telefone (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Telefone (opcional)
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(00) 00000-0000"
              className="input-glass"
            />
          </div>

          {/* Botão de Pesquisa */}
          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 flex items-center justify-center gap-2 group"
            >
              <Plane className="w-4 h-4" />
              <span>Buscar Seguros</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
