
import { toast } from "sonner";
import { fetchUniversalGet } from "./base";
import { UniversalBenefit } from "./types";

// GET /v1/beneficios - Obter benefícios disponíveis
export const getBenefits = async (idioma?: number, tipoTarifa?: number, isNacional?: boolean): Promise<UniversalBenefit[]> => {
  try {
    let endpoint = '/beneficios';
    const params = [];
    
    if (idioma) params.push(`idioma=${idioma}`);
    if (tipoTarifa) params.push(`tipoTarifa=${tipoTarifa}`);
    if (isNacional !== undefined) params.push(`isNacional=${isNacional}`);
    
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }
    
    return await fetchUniversalGet<UniversalBenefit[]>(endpoint);
  } catch (error) {
    console.error("Erro ao obter benefícios:", error);
    toast.error("Erro ao obter lista de benefícios");
    return [];
  }
};

// Função para obter os benefícios específicos para um produto
export const getProductBenefits = async (productId: string): Promise<UniversalBenefit[]> => {
  try {
    return await fetchUniversalGet<UniversalBenefit[]>(`/beneficios?produto=${productId}`);
  } catch (error) {
    console.error(`Erro ao obter benefícios do produto ${productId}:`, error);
    try {
      return await getBenefits();
    } catch (secondError) {
      console.error("Erro ao obter benefícios gerais:", secondError);
      return [];
    }
  }
};
