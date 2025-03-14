
import { toast } from "sonner";

// Tipos para as APIs
export interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
}

export interface InsuranceOffer {
  id: string;
  providerId: string;
  name: string;
  price: number;
  coverage: {
    medical: number;
    baggage: number;
    cancellation: number;
    delay: number;
    other?: Record<string, number>;
  };
  benefits: string[];
  rating: number;
  recommended: boolean;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: {
    count: number;
    ages: number[];
  };
  phone?: string;
}

// Lista de provedores simulados (será substituída pela API real)
const mockProviders: InsuranceProvider[] = [
  { id: "assist-card", name: "Assist Card", logo: "/placeholder.svg" },
  { id: "coris", name: "Coris Seguros", logo: "/placeholder.svg" },
  { id: "gc-assist", name: "GC Assist", logo: "/placeholder.svg" },
  { id: "intermac", name: "Intermac", logo: "/placeholder.svg" },
  { id: "universal-assist", name: "Universal Assist", logo: "/placeholder.svg" },
];

// Função para gerar ofertas simuladas (será substituída pela API real)
const generateMockOffers = (params: SearchParams): InsuranceOffer[] => {
  const { destination, passengers } = params;
  const tripDuration = calculateTripDuration(params.departureDate, params.returnDate);
  
  // Preço base por dia por pessoa
  const basePricePerDay = destination === "US" || destination === "CA" ? 12 : 
                          (["GB", "FR", "DE", "IT", "ES"].includes(destination) ? 10 : 8);
  
  return mockProviders.flatMap(provider => {
    // Cada provedor terá algumas ofertas
    const offerCount = Math.floor(Math.random() * 3) + 1;
    
    return Array.from({ length: offerCount }, (_, index) => {
      // Calcular multiplicador baseado na pessoa
      const priceModifier = 1 + (index * 0.5);
      
      // Calcular o preço total para todos os passageiros
      const totalPrice = passengers.ages.reduce((sum, age) => {
        const ageMultiplier = age < 18 ? 0.7 : (age > 65 ? 1.5 : 1);
        return sum + (basePricePerDay * tripDuration * priceModifier * ageMultiplier);
      }, 0);
      
      // Gerar uma oferta
      return {
        id: `${provider.id}-${index}`,
        providerId: provider.id,
        name: ["Básico", "Padrão", "Premium"][index] || "Personalizado",
        price: Math.round(totalPrice * 100) / 100,
        coverage: {
          medical: [30000, 60000, 100000][index] || 30000,
          baggage: [1000, 1500, 2000][index] || 1000,
          cancellation: [500, 1000, 2000][index] || 500,
          delay: [100, 200, 300][index] || 100,
        },
        benefits: [
          "Atendimento 24h em português",
          "Cobertura COVID-19",
          "Telemedicina",
          "Reembolso rápido",
          "Seguro de bagagem",
          "Esportes amadores"
        ].slice(0, 3 + index),
        rating: 3 + (Math.random() * 2),
        recommended: index === 1, // O plano padrão é o recomendado
      };
    });
  });
};

// Calcular a duração da viagem em dias
const calculateTripDuration = (departureDate: string, returnDate: string): number => {
  const start = new Date(departureDate);
  const end = new Date(returnDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Função que será substituída pela integração real com a API
export const searchInsurances = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    // Simular tempo de resposta da API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Gerar ofertas simuladas
    const offers = generateMockOffers(params);
    
    // Ordenar por preço (padrão)
    return offers.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error("Erro ao buscar seguros:", error);
    toast.error("Erro ao buscar seguros. Por favor, tente novamente.");
    return [];
  }
};

// Função para obter os provedores (será substituída pela API real)
export const getInsuranceProviders = async (): Promise<InsuranceProvider[]> => {
  // Simular tempo de resposta da API
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockProviders;
};

// Função para preparar os parâmetros da URL para a busca
export const parseSearchParams = (searchParams: URLSearchParams): SearchParams => {
  const origin = searchParams.get("origin") || "brasil";
  const destination = searchParams.get("destination") || "";
  const departureDate = searchParams.get("departureDate") || new Date().toISOString();
  const returnDate = searchParams.get("returnDate") || new Date().toISOString();
  const passengersStr = searchParams.get("passengers") || '{"count":1,"ages":[30]}';
  const phone = searchParams.get("phone") || undefined;
  
  let passengers;
  try {
    passengers = JSON.parse(passengersStr);
  } catch (e) {
    passengers = { count: 1, ages: [30] };
  }
  
  return {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    phone
  };
};
