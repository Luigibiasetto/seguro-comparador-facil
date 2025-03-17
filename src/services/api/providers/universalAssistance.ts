
import { toast } from "sonner";
import { getApiConfig } from "../config";
import { InsuranceOffer, SearchParams } from "../types";
import { 
  getQuote, 
  prepareQuotePayload, 
  testConnection,
  getProductBenefits
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
    
    // Tentativa direta usando a API
    try {
      console.log("Realizando cotação direta com a API");
      const quoteData = await getQuote(cotacaoPayload);
      console.log("Resposta da cotação:", quoteData);
      
      // Processar a resposta da API
      if (!quoteData) return generateMockOffers(5);
      
      // Extrair os produtos/planos
      let products = [];
      if (quoteData.produtos) {
        products = quoteData.produtos;
      } else if (quoteData.planos) {
        products = quoteData.planos;
      }
      
      if (products && products.length > 0) {
        console.log(`Produtos encontrados (${products.length}):`, products);
        
        // Para cada produto, tentar buscar os benefícios específicos
        for (const product of products) {
          try {
            if (product.id) {
              const benefits = await getProductBenefits(product.id);
              if (benefits && benefits.length > 0) {
                product.beneficios = benefits;
              }
            }
          } catch (benefitError) {
            console.error(`Erro ao buscar benefícios do produto ${product.id}:`, benefitError);
          }
        }
        
        return await processPlans(products);
      }
      
      // Se não encontrar produtos, exibir mensagem e usar dados mockados
      toast.warning("Nenhum produto encontrado na resposta da API", { 
        description: "Exibindo dados de exemplo",
        duration: 8000
      });
      
      return generateMockOffers(5);
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
      
      // Se a tentativa falhar, retornamos dados mockados
      return generateMockOffers(5);
    }
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
