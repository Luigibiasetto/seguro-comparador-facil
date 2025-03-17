
import { toast } from "sonner";
import { fetchUniversalGet } from "./base";
import { 
  UniversalClassification,
  UniversalTripType,
  UniversalCardOperator,
  UniversalDocumentType,
  UniversalTariffType,
  UniversalDestination,
  UniversalPassportCountry,
  UniversalCurrency
} from "./types";

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
