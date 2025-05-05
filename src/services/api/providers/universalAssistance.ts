
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
  getBenefits,
  getVoucherUrl
} from "./universalAssistance/api";
import { 
  processPlans, 
  generateMockOffers 
} from "./universalAssistance/dataProcessing";

export const fetchUniversalAssistanceOffers = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    console.log("Iniciando busca de dados da Universal Assistance com parâmetros:", params);
    const apiConfig = getApiConfig();
    
    if (!apiConfig.providerSettings?.username || !apiConfig.providerSettings?.password) {
      toast.error("Credenciais da Universal Assistance não configuradas");
      throw new Error("Credenciais da Universal Assistance não configuradas corretamente");
    }

    // Log configuração atual
    console.log("Configuração API:", {
      baseUrl: apiConfig.baseUrl,
      username: apiConfig.providerSettings.username,
      useProxy: apiConfig.useProxy
    });

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
        console.warn("Resposta de cotação vazia");
        throw new Error("Resposta de cotação vazia");
      }
      
      // Extrair os produtos/planos conforme documentação
      if (quoteData.produtos && quoteData.produtos.length > 0) {
        console.log(`Produtos encontrados (${quoteData.produtos.length}):`, quoteData.produtos);
        
        // Se houver um código de carrinho, recupere o URL do voucher
        if (quoteData.codigoCarrinho) {
          try {
            const voucherUrl = await getVoucherUrl(quoteData.codigoCarrinho);
            console.log("URL do voucher:", voucherUrl);
            quoteData.urlVoucher = voucherUrl;
          } catch (voucherError) {
            console.warn("Erro ao obter URL do voucher:", voucherError);
          }
        }
        
        const offers = await processPlans(quoteData.produtos);
        if (offers.length === 0) {
          throw new Error("Nenhuma oferta válida encontrada nos produtos");
        }
        return offers;
      } 
      // Verificar campo 'planos' se 'produtos' não existir
      else if (quoteData.planos && quoteData.planos.length > 0) {
        console.log(`Planos encontrados (${quoteData.planos.length}):`, quoteData.planos);
        
        const offers = await processPlans(quoteData.planos);
        if (offers.length === 0) {
          throw new Error("Nenhuma oferta válida encontrada nos planos");
        }
        return offers;
      }
      // Verificar se o próprio objeto da resposta é um array de produtos
      else if (Array.isArray(quoteData) && quoteData.length > 0) {
        console.log(`Array de produtos/planos encontrado (${quoteData.length}):`, quoteData);
        
        const offers = await processPlans(quoteData);
        if (offers.length === 0) {
          throw new Error("Nenhuma oferta válida encontrada no array");
        }
        return offers;
      }
      
      // Se não encontrar produtos, exibir mensagem informativa
      const errorMessage = quoteData.message || "Nenhum produto encontrado na resposta da API";
      throw new Error(errorMessage);
      
    } catch (apiError) {
      console.error("Erro na API de cotação:", apiError);
      let errorMessage = "Erro ao solicitar cotação";
      
      if (apiError instanceof Error) {
        errorMessage = apiError.message;
        // Melhorar mensagens de erro específicas
        if (errorMessage.includes("CORS") || errorMessage.includes("Failed to fetch")) {
          errorMessage = "Erro de conexão com a API. Verifique se o proxy está ativado nas configurações da API.";
        } else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
          errorMessage = "Credenciais inválidas. Verifique seu login e senha da Universal Assistance.";
        }
      }
      
      toast.error(errorMessage, {
        duration: 5000
      });
      
      // Lançamos o erro para ser tratado no componente
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Erro ao buscar dados da Universal Assistance:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao conectar com a API";
    
    toast.error("Erro na busca de seguros", {
      description: errorMessage,
      duration: 5000
    });
    
    // Retornar o erro para ser mostrado na interface
    throw error;
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
        
        // Buscar classificações e tipos de viagem para verificação completa
        const [classifications, tripTypes] = await Promise.all([
          getClassifications(),
          getTripTypes()
        ]);
        
        result.data = {
          ...result.data,
          benefits: benefits.slice(0, 5), // Limitamos para não sobrecarregar os logs
          classifications: classifications.slice(0, 5),
          tripTypes: tripTypes.slice(0, 5)
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
