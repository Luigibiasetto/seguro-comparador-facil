
import { toast } from "sonner";
import { fetchUniversalGet, fetchUniversalPost, fetchUniversalPut } from "./base";
import { getApiConfig } from "../../config";
import { UniversalSale } from "./types";

// GET /v1/Agencia/Vendas - Consultar vendas da agência
export const getAgencyVendas = async (inicio?: string, fim?: string, apenasTitular?: boolean): Promise<UniversalSale[]> => {
  try {
    let endpoint = '/Agencia/Vendas';
    const params = [];
    
    if (inicio) params.push(`inicio=${inicio}`);
    if (fim) params.push(`fim=${fim}`);
    if (apenasTitular !== undefined) params.push(`apenasTitular=${apenasTitular}`);
    
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }
    
    return await fetchUniversalGet<UniversalSale[]>(endpoint);
  } catch (error) {
    console.error("Erro ao obter vendas da agência:", error);
    toast.error("Erro ao obter vendas da agência");
    return [];
  }
};

// GET /v1/Agencia/ListarVendas - Listar vendas
export const listAgencyVendas = async (): Promise<UniversalSale[]> => {
  try {
    return await fetchUniversalGet<UniversalSale[]>('/Agencia/ListarVendas');
  } catch (error) {
    console.error("Erro ao listar vendas da agência:", error);
    toast.error("Erro ao listar vendas");
    return [];
  }
};

// POST /v1/Compras - Finalizar compra
export const finalizePurchase = async (purchaseData: any): Promise<any> => {
  try {
    return await fetchUniversalPost<any>('/Compras', purchaseData);
  } catch (error) {
    console.error("Erro ao finalizar compra:", error);
    toast.error("Erro ao finalizar compra");
    throw error;
  }
};

// POST /v1/cupom/adicionar - Adicionar cupom
export const addCoupon = async (couponCode: string): Promise<any> => {
  try {
    return await fetchUniversalPost<any>('/cupom/adicionar', { cupom: couponCode });
  } catch (error) {
    console.error("Erro ao adicionar cupom:", error);
    toast.error("Erro ao adicionar cupom");
    throw error;
  }
};

// PUT /v1/CancelamentoIndividual/:bilhete - Cancelamento individual
export const cancelIndividual = async (bilhete: string, motivo: string): Promise<any> => {
  try {
    return await fetchUniversalPut<any>(`/CancelamentoIndividual/${bilhete}`, { motivo });
  } catch (error) {
    console.error(`Erro ao cancelar bilhete ${bilhete}:`, error);
    toast.error("Erro ao realizar cancelamento");
    throw error;
  }
};

// GET /v1/Voucher/imprimir/:parametro - Gerar impressão do voucher
export const getVoucherPrintUrl = (carrinhoId: string): string => {
  const apiConfig = getApiConfig();
  return `${apiConfig.baseUrl}/Voucher/imprimir/${carrinhoId}`;
};
