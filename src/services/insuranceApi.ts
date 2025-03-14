
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

// Function to search for insurances
export const searchInsurances = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    console.log("Iniciando busca de seguros com parâmetros:", params);
    const apiConfig = getApiConfig();
    console.log("Configuração atual da API:", apiConfig);
    
    // If the API is not configured, alert the user
    if (!apiConfig.baseUrl && !apiConfig.provider) {
      toast.error("API de seguros não configurada. Configure a API antes de realizar buscas.");
      return [];
    }
    
    // Based on the provider, use the appropriate integration
    if (apiConfig.provider === "universal-assist") {
      console.log("Usando API da Universal Assistance para busca de seguros");
      const offers = await fetchUniversalAssistanceOffers(params);
      console.log(`${offers.length} ofertas encontradas`);
      return offers;
    } else {
      console.log("Usando API genérica para busca de seguros");
      const offers = await fetchGenericInsuranceOffers(params);
      console.log(`${offers.length} ofertas encontradas`);
      return offers;
    }
  } catch (error) {
    console.error("Erro ao buscar seguros:", error);
    toast.error("Erro ao buscar seguros. Por favor, verifique a configuração da API e tente novamente.");
    return [];
  }
};

// Function to get the providers (real API)
export const getInsuranceProviders = async (): Promise<InsuranceProvider[]> => {
  try {
    const apiConfig = getApiConfig();
    
    if (apiConfig.baseUrl) {
      return await fetchGenericProviders();
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
