
import { toast } from "sonner";
import { InsuranceOffer, InsuranceProvider, SearchParams } from "./api/types";
import { configureInsuranceAPI, getApiConfig } from "./api/config";
import { parseSearchParams } from "./api/utils";
import { fetchUniversalAssistanceOffers } from "./api/providers/universalAssistance";
import { fetchGenericInsuranceOffers, fetchGenericProviders } from "./api/providers/genericApi";
import { supabase } from "@/integrations/supabase/client";

// Lista de provedores - será buscada da API
const defaultProviders: InsuranceProvider[] = [
  { id: "assist-card", name: "Assist Card", logo: "/placeholder.svg" },
  { id: "coris", name: "Coris Seguros", logo: "/placeholder.svg" },
  { id: "gc-assist", name: "GC Assist", logo: "/placeholder.svg" },
  { id: "intermac", name: "Intermac", logo: "/placeholder.svg" },
  { id: "universal-assist", name: "Universal Assist", logo: "/placeholder.svg" },
];

// Função para buscar seguros
export const searchInsurances = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    console.log("Iniciando busca de seguros com parâmetros:", params);
    const apiConfig = getApiConfig();
    console.log("Configuração atual da API:", apiConfig);
    
    // Se a API não estiver configurada, alerta o usuário
    if (!apiConfig.baseUrl && !apiConfig.provider) {
      toast.error("API de seguros não configurada. Configure a API antes de realizar buscas.");
      return []; // Retorna array vazio
    }
    
    // Com base no provedor, usa a integração apropriada
    if (apiConfig.provider === "universal-assist") {
      console.log("Usando API da Universal Assistance para busca de seguros");
      
      try {
        // Primeiro, tenta usar a edge function do Supabase
        try {
          console.log("Tentando usar a Edge Function do Supabase");
          const { data, error } = await supabase.functions.invoke('universal-assist/search', {
            body: params
          });
          
          if (error) {
            console.error("Erro na Edge Function:", error);
            toast.error("Erro ao usar a Edge Function do Supabase", {
              description: error.message
            });
            // Continuar e tentar o método tradicional
          } else if (data && data.success) {
            console.log("Dados obtidos com sucesso via Edge Function:", data);
            return data.offers;
          } else if (data && !data.success && data.mockData) {
            console.log("Usando dados mockados da Edge Function");
            toast.warning("Usando dados simulados da API via Supabase", {
              description: data.error || "A conexão com a API falhou"
            });
            return data.mockData;
          }
        } catch (edgeFunctionError) {
          console.error("Erro ao chamar Edge Function:", edgeFunctionError);
          toast.error("Falha ao usar Edge Function Supabase", {
            description: "Tentando método alternativo..."
          });
          // Continuar e tentar o método tradicional
        }
        
        // Se a Edge Function falhar, tenta o método tradicional
        const offers = await fetchUniversalAssistanceOffers(params);
        console.log(`${offers.length} ofertas encontradas`);
        return offers;
      } catch (error) {
        console.error("Erro com a API da Universal Assistance:", error);
        
        // Verifica se o erro está relacionado a CORS e o proxy não está ativado
        if (!apiConfig.useProxy && error instanceof Error && 
            (error.message.includes('CORS') || error.message.includes('Failed to fetch'))) {
          toast.error("Erro de CORS detectado. Considere ativar a opção de proxy nas configurações da API ou usar o Supabase.", {
            duration: 8000
          });
        } else {
          toast.error("Erro ao buscar dados da Universal Assistance. Verifique o console para mais detalhes.");
        }
        
        return []; // Retorna array vazio
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
        return []; // Retorna array vazio
      }
    }
  } catch (error) {
    console.error("Erro ao buscar seguros:", error);
    toast.error("Erro ao buscar seguros. Por favor, verifique a configuração da API e tente novamente.");
    return []; // Retorna array vazio
  }
};

// Função para obter os provedores (API real)
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
      // Se nenhuma API estiver configurada, retorna provedores padrão
      return defaultProviders;
    }
  } catch (error) {
    console.error("Erro ao obter provedores:", error);
    toast.error("Erro ao carregar as seguradoras. Por favor, tente novamente.");
    return defaultProviders;
  }
};

// Re-exporta os tipos e funções de utilidade
export type { InsuranceProvider, InsuranceOffer, SearchParams };
export { configureInsuranceAPI, parseSearchParams };
