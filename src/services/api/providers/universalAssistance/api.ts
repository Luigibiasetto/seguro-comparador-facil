
import { toast } from "sonner";
import { getApiConfig, getApiUrl } from "../../config";
import { calculateTripDuration } from "../../utils";
import { SearchParams } from "../../types";
import { 
  UniversalBenefit,
  UniversalClassification,
  UniversalTripType,
  UniversalCardOperator,
  UniversalDocumentType,
  UniversalTariffType,
  UniversalDestination,
  UniversalPassportCountry,
  UniversalCurrency,
  UniversalSale,
  UniversalQuotePayload,
  UniversalQuoteResponse
} from "./types";

// Função para obter os headers com credenciais
export const getUniversalHeaders = () => {
  const apiConfig = getApiConfig();
  
  if (!apiConfig.providerSettings?.username || !apiConfig.providerSettings?.password) {
    throw new Error("Credenciais da Universal Assistance não configuradas corretamente");
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Login': apiConfig.providerSettings.username,
    'Senha': apiConfig.providerSettings.password,
    'Origin': window.location.origin
  };
};

// Função genérica para fazer uma requisição GET
export const fetchUniversalGet = async <T>(endpoint: string): Promise<T> => {
  const headers = getUniversalHeaders();
  const url = getApiUrl(endpoint);
  
  console.log(`Fazendo requisição GET para: ${url}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro na requisição GET ${endpoint}:`, errorText);
    throw new Error(`Falha na requisição GET ${endpoint}: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return data as T;
};

// Função genérica para fazer uma requisição POST
export const fetchUniversalPost = async <T>(endpoint: string, payload: any): Promise<T> => {
  const headers = getUniversalHeaders();
  const url = getApiUrl(endpoint);
  
  console.log(`Fazendo requisição POST para: ${url}`);
  console.log('Payload:', payload);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro na requisição POST ${endpoint}:`, errorText);
    throw new Error(`Falha na requisição POST ${endpoint}: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return data as T;
};

// Função genérica para fazer uma requisição PUT
export const fetchUniversalPut = async <T>(endpoint: string, payload: any): Promise<T> => {
  const headers = getUniversalHeaders();
  const url = getApiUrl(endpoint);
  
  console.log(`Fazendo requisição PUT para: ${url}`);
  console.log('Payload:', payload);
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro na requisição PUT ${endpoint}:`, errorText);
    throw new Error(`Falha na requisição PUT ${endpoint}: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return data as T;
};

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

// GET /v1/tipoviagem - Listar tipos de viagem
export const getTripTypes = async (): Promise<UniversalTripType[]> => {
  try {
    return await fetchUniversalGet<UniversalTripType[]>('/tipoviagem');
  } catch (error) {
    console.error("Erro ao obter tipos de viagem:", error);
    toast.error("Erro ao obter tipos de viagem");
    return [];
  }
};

// GET /v1/Voucher/imprimir/:parametro - Gerar impressão do voucher
export const getVoucherPrintUrl = (carrinhoId: string): string => {
  const apiConfig = getApiConfig();
  return `${apiConfig.baseUrl}/Voucher/imprimir/${carrinhoId}`;
};

// GET /v1/operadoras - Listar operadoras (bandeiras de cartão)
export const getCardOperators = async (): Promise<UniversalCardOperator[]> => {
  try {
    return await fetchUniversalGet<UniversalCardOperator[]>('/operadoras');
  } catch (error) {
    console.error("Erro ao obter operadoras de cartão:", error);
    toast.error("Erro ao obter bandeiras de cartão");
    return [];
  }
};

// GET /v1/tiposdocumento - Listar tipos de documentos
export const getDocumentTypes = async (): Promise<UniversalDocumentType[]> => {
  try {
    return await fetchUniversalGet<UniversalDocumentType[]>('/tiposdocumento');
  } catch (error) {
    console.error("Erro ao obter tipos de documento:", error);
    toast.error("Erro ao obter tipos de documento");
    return [];
  }
};

// GET /v1/classificacoes - Obter classificações
export const getClassifications = async (): Promise<UniversalClassification[]> => {
  try {
    return await fetchUniversalGet<UniversalClassification[]>('/classificacoes');
  } catch (error) {
    console.error("Erro ao obter classificações:", error);
    toast.error("Erro ao obter classificações");
    return [];
  }
};

// GET /v1/tipostarifa - Listar tipos de tarifa
export const getTariffTypes = async (): Promise<UniversalTariffType[]> => {
  try {
    return await fetchUniversalGet<UniversalTariffType[]>('/tipostarifa');
  } catch (error) {
    console.error("Erro ao obter tipos de tarifa:", error);
    toast.error("Erro ao obter tipos de tarifa");
    return [];
  }
};

// GET /v1/destinos/:id - Buscar destino específico
export const getDestination = async (id: string): Promise<UniversalDestination> => {
  try {
    return await fetchUniversalGet<UniversalDestination>(`/destinos/${id}`);
  } catch (error) {
    console.error(`Erro ao obter destino ${id}:`, error);
    toast.error("Erro ao obter informações do destino");
    throw error;
  }
};

// GET /v1/paisesPassaporte - Listar países/passaportes
export const getPassportCountries = async (): Promise<UniversalPassportCountry[]> => {
  try {
    return await fetchUniversalGet<UniversalPassportCountry[]>('/paisesPassaporte');
  } catch (error) {
    console.error("Erro ao obter países/passaportes:", error);
    toast.error("Erro ao obter lista de países");
    return [];
  }
};

// GET /v1/Emissor/Setup - Configuração inicial do emissor
export const getEmissorSetup = async (): Promise<any> => {
  try {
    return await fetchUniversalGet<any>('/Emissor/Setup');
  } catch (error) {
    console.error("Erro ao obter configuração do emissor:", error);
    toast.error("Erro ao obter configuração do emissor");
    return {};
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

// GET /v1/moedas - Listar moedas
export const getCurrencies = async (): Promise<UniversalCurrency[]> => {
  try {
    return await fetchUniversalGet<UniversalCurrency[]>('/moedas');
  } catch (error) {
    console.error("Erro ao obter moedas:", error);
    toast.error("Erro ao obter lista de moedas");
    return [];
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

// GET /v1/melius - Obter informações "melius"
export const getMelius = async (): Promise<any> => {
  try {
    return await fetchUniversalGet<any>('/melius');
  } catch (error) {
    console.error("Erro ao obter informações melius:", error);
    toast.error("Erro ao obter informações adicionais");
    return {};
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

// POST /v1/Cotacao - Cotação de seguro
export const getQuote = async (payload: UniversalQuotePayload): Promise<UniversalQuoteResponse> => {
  try {
    console.log("Enviando requisição de cotação com payload:", payload);
    
    if (!payload.destinos || !payload.passageiros || !payload.dataSaida || !payload.dataRetorno) {
      throw new Error("Payload de cotação incompleto. Verifique os campos obrigatórios.");
    }
    
    console.log("Headers da requisição:", getUniversalHeaders());
    
    const response = await fetchUniversalPost<UniversalQuoteResponse>('/Cotacao', payload);
    console.log("Resposta da cotação:", response);
    
    return response;
  } catch (error) {
    console.error("Erro ao obter cotação:", error);
    toast.error("Erro ao obter cotação de seguro: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    throw error;
  }
};

// Função para preparar o payload de cotação conforme documentação
export const prepareQuotePayload = (params: SearchParams): UniversalQuotePayload => {
  const departureFormatted = new Date(params.departureDate).toISOString().split('T')[0];
  const returnFormatted = new Date(params.returnDate).toISOString().split('T')[0];
  
  const passageiros = params.passengers.ages.map(age => {
    return {
      nome: `Passageiro ${age} anos`,
      dataNascimento: calculateBirthDate(age)
    };
  });
  
  const tipoViagem = params.destination === "BR" ? 0 : 1;
  const destinos = [getDestinationCode(params.destination)];
  
  return {
    destinos: destinos,
    passageiros: passageiros,
    dataSaida: departureFormatted,
    dataRetorno: returnFormatted,
    tipoViagem: tipoViagem,
    tipoTarifa: 1,  // 1 para Folheto (padrão)
    produtoAvulso: false,
    cupom: "",
    classificacoes: [1]  // 1 = "Todos" conforme documentação
  };
};

// Função para testar a conexão com a API
export const testConnection = async (): Promise<{ success: boolean, message: string, data?: any }> => {
  try {
    const classifications = await getClassifications();
    return {
      success: true,
      message: "Conexão com a API estabelecida com sucesso",
      data: classifications
    };
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido ao testar conexão"
    };
  }
};

// Função auxiliar para calcular data de nascimento baseada na idade
function calculateBirthDate(age: number): string {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  return `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// Função para converter o destino em código conforme esperado pela API
function getDestinationCode(destination: string): string {
  const destinationMap: Record<string, string> = {
    "NAMERICA": "NA", // América do Norte
    "SAMERICA": "SA", // América do Sul
    "EUROPE": "EU",   // Europa
    "ASIA": "AS",     // Ásia
    "AFRICA": "AF",   // África
    "OCEANIA": "OC",  // Oceania
    "BR": "BR"        // Brasil
  };
  
  return destinationMap[destination] || destination;
}

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
