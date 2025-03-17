
import { toast } from "sonner";
import { getApiConfig } from "../config";
import { InsuranceOffer, SearchParams } from "../types";
import { 
  getQuote, 
  prepareQuotePayload, 
  testConnection,
  getProductBenefits,
  getClassifications,
  getTripTypes,
  getBenefits
} from "./universalAssistance/api";
import { 
  processPlans, 
  generateMockOffers 
} from "./universalAssistance/dataProcessing";

export const fetchUniversalAssistanceOffers = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    console.log("Iniciando busca de dados da Universal Assistance");
    const apiConfig = getApiConfig();
    
    if (!apiConfig.providerSettings?.username || !apiConfig.providerSettings?.password) {
      throw new Error("Credenciais da Universal Assistance não configuradas corretamente");
    }

    // Log configuração atual
    console.log("Configuração API:", {
      baseUrl: apiConfig.baseUrl,
      username: apiConfig.providerSettings.username,
      useProxy: apiConfig.useProxy,
      debugMode: apiConfig.debugMode
    });

    // Pré-validação: buscar classificações e tipos de viagem para verificar a conexão
    try {
      console.log("Validando conexão com a API");
      const [classifications, tripTypes] = await Promise.all([
        getClassifications(),
        getTripTypes()
      ]);
      console.log("Classificações disponíveis:", classifications);
      console.log("Tipos de viagem disponíveis:", tripTypes);
    } catch (validationError) {
      console.error("Erro na validação inicial da API:", validationError);
      // Continuamos mesmo com erro na validação
    }

    // Preparar payload conforme documentação
    const cotacaoPayload = prepareQuotePayload(params);
    console.log("Payload de cotação:", cotacaoPayload);
    
    // Realizar cotação direta com a API
    try {
      console.log("Realizando cotação direta com a API");
      const quoteData = await getQuote(cotacaoPayload);
      console.log("Resposta completa da cotação:", quoteData);
      
      // Processar a resposta da API
      if (!quoteData) {
        console.warn("Resposta de cotação vazia, usando dados mockados");
        return generateMockOffers(5);
      }
      
      // Extrair os produtos/planos conforme documentação
      if (quoteData.produtos && quoteData.produtos.length > 0) {
        console.log(`Produtos encontrados (${quoteData.produtos.length}):`, quoteData.produtos);
        
        // Enriquecer produtos com benefícios específicos
        for (const product of quoteData.produtos) {
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
        
        return await processPlans(quoteData.produtos);
      } 
      // Verificar campo 'planos' se 'produtos' não existir
      else if (quoteData.planos && quoteData.planos.length > 0) {
        console.log(`Planos encontrados (${quoteData.planos.length}):`, quoteData.planos);
        return await processPlans(quoteData.planos);
      }
      // Verificar se o próprio objeto da resposta é um array de produtos
      else if (Array.isArray(quoteData) && quoteData.length > 0) {
        console.log(`Array de produtos/planos encontrado (${quoteData.length}):`, quoteData);
        return await processPlans(quoteData);
      }
      // Se não encontrar produtos estruturados, mas tiver campo de benefícios, tenta usar
      else if (quoteData.beneficios && Array.isArray(quoteData.beneficios)) {
        console.log("Nenhum produto estruturado encontrado, mas há benefícios. Gerando oferta genérica.");
        
        // Criar um produto genérico a partir dos benefícios
        const genericProduct = {
          id: "generic-universal",
          nome: "Plano Universal Standard",
          preco: 150, // Valor padrão
          beneficios: quoteData.beneficios
        };
        
        return await processPlans([genericProduct]);
      }
      
      // Se não encontrar produtos, exibir mensagem e usar dados mockados
      toast.warning("Nenhum produto encontrado na resposta da API", { 
        description: "Exibindo dados de exemplo",
        duration: 8000
      });
      
      return generateMockOffers(5);
    } catch (apiError) {
      console.error("Erro na API de cotação:", apiError);
      toast.error("Erro ao solicitar cotação", {
        description: apiError instanceof Error ? apiError.message : "Erro desconhecido",
        duration: 5000
      });
      
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
    const result = await testConnection();
    
    // Se for bem sucedido, também tentamos buscar benefícios para verificar
    if (result.success) {
      try {
        const benefits = await getBenefits();
        console.log("Benefícios recuperados durante o teste:", benefits);
        result.data = {
          ...result.data,
          benefits: benefits.slice(0, 5) // Limitamos para não sobrecarregar os logs
        };
      } catch (benefitsError) {
        console.warn("Teste de conexão bem sucedido, mas falha ao buscar benefícios:", benefitsError);
      }
    }
    
    return result;
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
