
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Calendar, ArrowRight, Users, Mail } from "lucide-react";
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
import PassengerSelect from "./PassengerSelect";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

// Tipos para origem e destino com base na API da Universal Assistance
type OriginType = "BR" | "INT-BR";
type DestinationType = "NAMERICA" | "SAMERICA" | "EUROPE" | "ASIA" | "AFRICA" | "OCEANIA";

interface SearchFormProps {
  className?: string;
  defaultExpanded?: boolean;
}

const SearchForm = ({ className = "", defaultExpanded = true }: SearchFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados do formulário
  const [origin, setOrigin] = useState<OriginType>("BR");
  const [destination, setDestination] = useState<DestinationType | "">("");
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
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados da UI
  const [isDepartureFocused, setIsDepartureFocused] = useState(false);
  const [isReturnFocused, setIsReturnFocused] = useState(false);

  // Continentes para seleção de destino conforme especificações da Universal Assistance
  const continents = [
    { id: "NAMERICA", name: "América do Norte" },
    { id: "SAMERICA", name: "América do Sul" },
    { id: "EUROPE", name: "Europa" },
    { id: "ASIA", name: "Ásia" },
    { id: "AFRICA", name: "África" },
    { id: "OCEANIA", name: "Oceania" },
  ];

  // Validações básicas
  const isValidForm = () => {
    if (!destination) {
      toast({
        title: "Destino necessário",
        description: "Por favor, selecione o destino.",
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

    if (!phone || phone.length < 14) {  // Verificação para (XX) XXXXX-XXXX = 14 caracteres
      toast({
        title: "Telefone inválido",
        description: "Por favor, informe um telefone válido.",
        variant: "destructive",
      });
      return false;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido.",
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Salvar lead no banco de dados
  const saveLead = async () => {
    try {
      if (!departureDate || !returnDate) return false;
      
      const leadData = {
        email,
        phone,
        origin,
        destination,
        departure_date: departureDate.toISOString(),
        return_date: returnDate.toISOString(),
        passengers: {
          adults: passengers.count,
          children: 0,
          ages: passengers.ages
        }
      };

      const { error } = await supabase
        .from('leads')
        .insert([leadData]);

      if (error) {
        console.error("Erro ao salvar lead:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao processar lead:", error);
      return false;
    }
  };

  // Manipulador de envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Salvar o lead no banco de dados
      const leadSaved = await saveLead();
      if (!leadSaved) {
        sonnerToast.error("Erro ao salvar seus dados. Tente novamente mais tarde.");
      }
      
      // Construir a URL de pesquisa
      const searchParams = new URLSearchParams();
      searchParams.append("origin", origin);
      searchParams.append("destination", destination);
      searchParams.append("departureDate", departureDate?.toISOString() || "");
      searchParams.append("returnDate", returnDate?.toISOString() || "");
      searchParams.append("passengers", JSON.stringify(passengers));
      searchParams.append("phone", phone);
      searchParams.append("email", email);
      
      // Navegar para a página de resultados
      navigate(`/resultados?${searchParams.toString()}`);
    } catch (error) {
      console.error("Erro no processamento:", error);
      sonnerToast.error("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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
    if (origin === "INT-BR") {
      return "Continente de Origem";
    } else {
      return "Continente de Destino";
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
                <RadioGroupItem value="BR" id="option-brasil" />
                <Label htmlFor="option-brasil">Brasil</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INT-BR" id="option-estrangeiro-brasil" />
                <Label htmlFor="option-estrangeiro-brasil">Estrangeiro vindo ao Brasil</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Seleção de Destino/Continente */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getDestinationLabel()}
            </label>
            <div className="input-glass w-full rounded-lg">
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value as DestinationType)}
                className="w-full px-3 py-2.5 rounded-lg bg-transparent border-0 focus:ring-0 focus:outline-none"
              >
                <option value="">Selecione {origin === "INT-BR" ? "o continente de origem" : "o continente de destino"}</option>
                {continents.map((continent) => (
                  <option key={continent.id} value={continent.id}>
                    {continent.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
          <div>
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

          {/* Email (obrigatório) - Novo campo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email *
            </label>
            <div className="flex items-center input-glass rounded-lg">
              <Mail className="ml-3 w-4 h-4 text-gray-500" />
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="seu@email.com"
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
          </div>

          {/* Telefone (obrigatório) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Telefone *
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(00) 00000-0000"
              className="input-glass"
              required
            />
          </div>

          {/* Botão de Pesquisa */}
          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2.5 flex items-center justify-center gap-2 group"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Processando...</span>
              ) : (
                <>
                  <Plane className="w-4 h-4" />
                  <span>Buscar Seguros</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
