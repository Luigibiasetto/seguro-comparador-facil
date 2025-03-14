
import { toast } from "sonner";
import { InsuranceOffer, InsuranceProvider, SearchParams } from "./api/types";
import { configureInsuranceAPI, getApiConfig } from "./api/config";
import { parseSearchParams } from "./api/utils";
import { fetchUniversalAssistanceOffers } from "./api/providers/universalAssistance";
import { fetchGenericInsuranceOffers, fetchGenericProviders } from "./api/providers/genericApi";

// List of providers - will be fetched from the API
const defaultProviders: InsuranceProvider[] = [
  { id: "assist-card", name: "Assist Card", logo: "/placeholder.svg" },
  { id: "coris", name: "Coris Seguros", logo: "/placeholder.svg" },
  { id: "gc-assist", name: "GC Assist", logo: "/placeholder.svg" },
  { id: "intermac", name: "Intermac", logo: "/placeholder.svg" },
  { id: "universal-assist", name: "Universal Assist", logo: "/placeholder.svg" },
];

// Mock insurance offers for testing purposes
const mockOffers: InsuranceOffer[] = [
  {
    id: "universal-1",
    providerId: "universal-assist",
    name: "Plano Essencial",
    price: 199.9,
    coverage: {
      medical: 40000,
      baggage: 1000,
      cancellation: 2000,
      delay: 200
    },
    benefits: ["COVID-19", "Telemedicina", "Traslado médico"],
    rating: 4.5,
    recommended: true
  },
  {
    id: "universal-2",
    providerId: "universal-assist",
    name: "Plano Premium",
    price: 299.9,
    coverage: {
      medical: 80000,
      baggage: 1500,
      cancellation: 3000,
      delay: 300
    },
    benefits: ["COVID-19", "Telemedicina", "Traslado médico", "Esportes aventura"],
    rating: 4.7,
    recommended: false
  }
];

// Function to search for insurances
export const searchInsurances = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    console.log("Iniciando busca de seguros com parâmetros:", params);
    const apiConfig = getApiConfig();
    console.log("Configuração atual da API:", apiConfig);
    
    // If the API is not configured, alert the user
    if (!apiConfig.baseUrl && !apiConfig.provider) {
      toast.error("API de seguros não configurada. Configure a API antes de realizar buscas.");
      return mockOffers; // Return mock data instead of empty array for better user experience
    }
    
    // Based on the provider, use the appropriate integration
    if (apiConfig.provider === "universal-assist") {
      console.log("Usando API da Universal Assistance para busca de seguros");
      try {
        const offers = await fetchUniversalAssistanceOffers(params);
        console.log(`${offers.length} ofertas encontradas`);
        
        // If no offers found, return mock data for better user experience
        if (offers.length === 0) {
          toast.info("Usando dados de demonstração pois não foram encontradas ofertas reais.");
          return mockOffers;
        }
        
        return offers;
      } catch (error) {
        console.error("Erro com a API da Universal Assistance, usando dados mockados:", error);
        toast.warning("Usando dados de demonstração devido a um erro na API.");
        return mockOffers;
      }
    } else {
      console.log("Usando API genérica para busca de seguros");
      try {
        const offers = await fetchGenericInsuranceOffers(params);
        console.log(`${offers.length} ofertas encontradas`);
        
        // If no offers found, return mock data for better user experience
        if (offers.length === 0) {
          toast.info("Usando dados de demonstração pois não foram encontradas ofertas reais.");
          return mockOffers;
        }
        
        return offers;
      } catch (error) {
        console.error("Erro com a API genérica, usando dados mockados:", error);
        toast.warning("Usando dados de demonstração devido a um erro na API.");
        return mockOffers;
      }
    }
  } catch (error) {
    console.error("Erro ao buscar seguros:", error);
    toast.error("Erro ao buscar seguros. Por favor, verifique a configuração da API e tente novamente.");
    return mockOffers; // Return mock data instead of empty array for better user experience
  }
};

// Function to get the providers (real API)
export const getInsuranceProviders = async (): Promise<InsuranceProvider[]> => {
  try {
    const apiConfig = getApiConfig();
    
    if (apiConfig.baseUrl) {
      try {
        return await fetchGenericProviders();
      } catch (error) {
        console.error("Erro ao obter provedores da API, usando lista padrão:", error);
        return defaultProviders;
      }
    } else {
      // If no API is configured, return default providers
      return defaultProviders;
    }
  } catch (error) {
    console.error("Erro ao obter provedores:", error);
    toast.error("Erro ao carregar as seguradoras. Por favor, tente novamente.");
    return defaultProviders;
  }
};

// Re-export the types and utility functions
export type { InsuranceProvider, InsuranceOffer, SearchParams };
export { configureInsuranceAPI, parseSearchParams };
