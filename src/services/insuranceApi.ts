
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
      return []; // Return empty array
    }
    
    // Based on the provider, use the appropriate integration
    if (apiConfig.provider === "universal-assist") {
      console.log("Usando API da Universal Assistance para busca de seguros");
      try {
        const offers = await fetchUniversalAssistanceOffers(params);
        console.log(`${offers.length} ofertas encontradas`);
        return offers;
      } catch (error) {
        console.error("Erro com a API da Universal Assistance:", error);
        
        // Check if error is related to CORS and proxy is not enabled
        if (!apiConfig.useProxy && error instanceof Error && 
            (error.message.includes('CORS') || error.message.includes('Failed to fetch'))) {
          toast.error("Erro de CORS detectado. Considere ativar a opção de proxy nas configurações da API.", {
            duration: 8000
          });
        } else {
          toast.error("Erro ao buscar dados da Universal Assistance. Verifique o console para mais detalhes.");
        }
        
        return []; // Return empty array
      }
    } else {
      console.log("Usando API genérica para busca de seguros");
      try {
        const offers = await fetchGenericInsuranceOffers(params);
        console.log(`${offers.length} ofertas encontradas`);
        return offers;
      } catch (error) {
        console.error("Erro com a API genérica:", error);
        toast.error("Erro ao buscar dados da API. Verifique o console para mais detalhes.");
        return []; // Return empty array
      }
    }
  } catch (error) {
    console.error("Erro ao buscar seguros:", error);
    toast.error("Erro ao buscar seguros. Por favor, verifique a configuração da API e tente novamente.");
    return []; // Return empty array
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
