
import { toast } from "sonner";
import { InsuranceOffer, InsuranceProvider, SearchParams, Lead } from "./api/types";
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
    
    // Salvar lead no banco de dados de forma assíncrona (não aguardar resposta)
    saveLead({
      email: params.email,
      phone: params.phone,
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      passengers: params.passengers
    }).catch(leadError => {
      console.error("Erro ao salvar lead:", leadError);
      // Continua a busca mesmo com erro no lead
    });
    
    // Se a API não estiver configurada, alerta o usuário
    if (!apiConfig.baseUrl && !apiConfig.provider) {
      toast.error("API de seguros não configurada. Configure a API antes de realizar buscas.");
      throw new Error("API de seguros não configurada. Configure a API antes de realizar buscas.");
    }
    
    // Definir um timeout para a operação
    const timeoutPromise = new Promise<InsuranceOffer[]>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout na busca de seguros. A operação demorou muito tempo."));
      }, 25000); // 25 segundos
    });
    
    // Com base no provedor, usa a integração apropriada
    if (apiConfig.provider === "universal-assist") {
      console.log("Usando API da Universal Assistance para busca de seguros");
      
      try {
        // Competição entre a busca real e o timeout
        const offers = await Promise.race([
          fetchUniversalAssistanceOffers(params),
          timeoutPromise
        ]);
        
        if (!offers || offers.length === 0) {
          throw new Error("Nenhum seguro encontrado para os parâmetros informados.");
        }
        
        console.log(`${offers.length} ofertas encontradas`);
        return offers;
      } catch (error) {
        console.error("Erro com a API da Universal Assistance:", error);
        
        let errorMessage = "Erro ao buscar dados da Universal Assistance.";
        
        if (error instanceof Error) {
          errorMessage = error.message;
          
          // Verifica se o erro está relacionado a CORS e o proxy não está ativado
          if (!apiConfig.useProxy && 
              (errorMessage.includes('CORS') || 
              errorMessage.includes('Failed to fetch') || 
              errorMessage.includes('fetch'))) {
            toast.error("Erro de conexão detectado. Considere ativar a opção de proxy nas configurações da API.", {
              duration: 8000
            });
            
            errorMessage = "Erro de conexão com a API. Ative a opção de proxy nas configurações.";
          }
        }
        
        throw new Error(errorMessage);
      }
    } else {
      console.log("Usando API genérica para busca de seguros");
      try {
        // Competição entre a busca real e o timeout
        const offers = await Promise.race([
          fetchGenericInsuranceOffers(params),
          timeoutPromise
        ]);
        
        if (!offers || offers.length === 0) {
          throw new Error("Nenhum seguro encontrado para os parâmetros informados.");
        }
        
        console.log(`${offers.length} ofertas encontradas`);
        return offers;
      } catch (error) {
        console.error("Erro com a API genérica:", error);
        
        let errorMessage = "Erro ao buscar dados da API.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }
    }
  } catch (error) {
    console.error("Erro ao buscar seguros:", error);
    
    let errorMessage = "Erro ao buscar seguros. Por favor, verifique a configuração da API e tente novamente.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
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

// Salvar lead no banco de dados
export const saveLead = async (lead: Omit<Lead, 'id' | 'created_at'>): Promise<boolean> => {
  try {
    // Converter do formato do frontend para o formato do banco
    const supabaseLead = {
      email: lead.email,
      phone: lead.phone,
      origin: lead.origin,
      destination: lead.destination,
      departure_date: typeof lead.departureDate === 'string' ? lead.departureDate : lead.departureDate?.toISOString(),
      return_date: typeof lead.returnDate === 'string' ? lead.returnDate : lead.returnDate?.toISOString(),
      passengers: lead.passengers
    };

    const { error } = await supabase
      .from('leads')
      .insert([supabaseLead]);

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

// Buscar leads do banco de dados (apenas para admins)
export const getLeads = async (): Promise<Lead[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar leads:", error);
      toast.error("Erro ao carregar leads");
      return [];
    }

    // Converter do formato do banco para o formato do frontend
    const leads: Lead[] = (data || []).map(item => {
      // Garantir que passengers é um objeto com o formato correto
      const passengersData = typeof item.passengers === 'string' 
        ? JSON.parse(item.passengers) 
        : item.passengers;
        
      return {
        id: item.id,
        email: item.email,
        phone: item.phone,
        origin: item.origin,
        destination: item.destination,
        departureDate: item.departure_date,
        returnDate: item.return_date,
        departure_date: item.departure_date,
        return_date: item.return_date,
        passengers: {
          adults: passengersData.adults || 0,
          children: passengersData.children || 0,
          ages: passengersData.ages || [],
          count: passengersData.count
        },
        created_at: item.created_at
      };
    });

    return leads;
  } catch (error) {
    console.error("Erro inesperado:", error);
    toast.error("Erro ao carregar dados");
    return [];
  }
};

// Re-exporta os tipos e funções de utilidade
export type { InsuranceProvider, InsuranceOffer, SearchParams, Lead };
export { configureInsuranceAPI, parseSearchParams };
