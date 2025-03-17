
import { toast } from "sonner";
import { getApiConfig } from "../config";
import { InsuranceOffer, SearchParams } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { 
  getQuote, 
  prepareQuotePayload, 
  testConnection
} from "./universalAssistance/api";
import { 
  processPlans, 
  generateMockOffers 
} from "./universalAssistance/dataProcessing";
import { UniversalQuoteResponse } from "./universalAssistance/types";

export const fetchUniversalAssistanceOffers = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    console.log("Iniciando busca de dados da Universal Assistance");
    const apiConfig = getApiConfig();
    console.log("Configuração da API:", apiConfig);
    
    if (!apiConfig.providerSettings?.username || !apiConfig.providerSettings?.password) {
      throw new Error("Credenciais da Universal Assistance não configuradas corretamente");
    }

    // Preparar payload conforme documentação
    const cotacaoPayload = prepareQuotePayload(params);
    console.log("Payload de cotação:", cotacaoPayload);
    
    // Função para processar a resposta da API
    const processApiResponse = async (data: UniversalQuoteResponse): Promise<InsuranceOffer[]> => {
      if (!data) return [];
      
      // Extrair os produtos/planos
      let products = [];
      if (data.produtos) {
        products = data.produtos;
      } else if (data.planos) {
        products = data.planos;
      }
      
      if (products.length > 0) {
        console.log(`Produtos encontrados (${products.length}):`, products);
        return await processPlans(products);
      }
      
      return [];
    };
    
    // Tentativa com Edge Function do Supabase
    if (apiConfig.useSupabase) {
      console.log("Tentando cotação via Edge Function do Supabase");
      try {
        const { data: edgeFunctionData, error } = await supabase.functions.invoke('universal-assist/cotacao', {
          body: {
            credentials: {
              login: apiConfig.providerSettings.username,
              senha: apiConfig.providerSettings.password
            },
            payload: cotacaoPayload
          }
        });
        
        if (error) {
          console.error("Erro na Edge Function:", error);
        } else if (edgeFunctionData && edgeFunctionData.success && edgeFunctionData.data) {
          console.log("Dados obtidos via Edge Function:", edgeFunctionData);
          const offers = await processApiResponse(edgeFunctionData.data);
          if (offers.length > 0) {
            return offers;
          }
        }
      } catch (edgeFunctionError) {
        console.error("Erro ao chamar Edge Function:", edgeFunctionError);
      }
    }
    
    // Tentativa direta usando a API
    try {
      console.log("Tentando cotação direta com a API");
      const quoteData = await getQuote(cotacaoPayload);
      console.log("Resposta da cotação:", quoteData);
      
      const offers = await processApiResponse(quoteData);
      if (offers.length > 0) {
        return offers;
      }
    } catch (apiError) {
      console.error("Erro na API de cotação:", apiError);
      
      // Verificamos se o erro está relacionado a CORS
      if (!apiConfig.useProxy && apiError instanceof Error && 
          (apiError.message.includes('CORS') || apiError.message.includes('Failed to fetch'))) {
        toast.error("Erro de CORS detectado", {
          description: "Considere ativar o proxy nas configurações da API",
          duration: 8000
        });
      } else {
        toast.error("Erro ao solicitar cotação", {
          description: apiError instanceof Error ? apiError.message : "Erro desconhecido",
          duration: 5000
        });
      }
    }
    
    // Se todas as tentativas falharam, exibimos um erro e retornamos dados mockados
    console.warn("Todas as tentativas de obter cotação falharam. Usando dados mockados.");
    toast.error("Não foi possível obter cotações da Universal Assistance", {
      description: "Exibindo dados de exemplo",
      duration: 8000
    });
    
    return generateMockOffers(5);
  } catch (error) {
    console.error("Erro ao buscar dados da Universal Assistance:", error);
    toast.error("Erro ao conectar com a API da Universal Assistance", {
      description: error instanceof Error ? error.message : "Erro desconhecido",
      duration: 5000
    });
    
    return generateMockOffers(5);
  }
};

// Testa a conexão com a API da Universal Assistance
export const testUniversalAssistanceConnection = async (): Promise<{ success: boolean, message: string, data?: any }> => {
  try {
    return await testConnection();
  } catch (error) {
    console.error("Erro no teste de conexão:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido ao testar conexão"
    };
  }
};

// Re-exportar as funções da API para uso direto
export * from './universalAssistance/api';
