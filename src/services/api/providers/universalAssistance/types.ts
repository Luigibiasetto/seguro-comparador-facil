
import { SearchParams } from "../../types";

// Interfaces for the Universal Assistance API

export interface UniversalBenefit {
  id?: string | number;
  nome?: string;
  descricao?: string;
  valor?: number | string;
  valorEmDinheiro?: number;
  tipo?: string;
  categoria?: string;
}

export interface UniversalClassification {
  id: number;
  descricao: string;
  tipoTarifa?: number;
}

export interface UniversalTripType {
  id: number;
  descricao: string;
}

export interface UniversalCardOperator {
  id: number;
  nome: string;
}

export interface UniversalDocumentType {
  id: number;
  descricao: string;
}

export interface UniversalTariffType {
  id: number;
  descricao: string;
}

export interface UniversalDestination {
  id: string;
  nome: string;
  codigo?: string;
  internacional?: boolean;
}

export interface UniversalPassportCountry {
  id: number;
  nome: string;
  codigo?: string;
}

export interface UniversalCurrency {
  id: number;
  nome: string;
  simbolo: string;
  codigo: string;
}

export interface UniversalSale {
  id: string;
  dataVenda: string;
  valorTotal: number;
  moeda: string;
  status: string;
  titular?: {
    nome: string;
    email?: string;
    telefone?: string;
  };
  passageiros?: Array<{
    nome: string;
    documento?: string;
    idade?: number;
  }>;
  destinos?: string[];
}

// Payload para a requisição de cotação
export interface UniversalQuotePayload {
  destinos: string[];
  passageiros: Array<{
    nome: string;
    dataNascimento: string;
  }>;
  dataSaida: string;
  dataRetorno: string;
  tipoViagem: number;  // 0 para nacional, 1 para internacional
  tipoTarifa: number;  // 1 para Folheto, 2 para Acordo
  produtoAvulso: boolean;
  cupom: string;
  classificacoes: number[];
}

// Produto retornado pela API
export interface UniversalProduct {
  id?: string;
  codigo?: string;
  nome?: string;
  descricao?: string;
  preco?: number | string;
  valorBruto?: number | string;
  valorBrutoBrl?: number | string;
  valorBrutoUsd?: number | string;
  moeda?: string;
  beneficios?: Array<UniversalBenefit | string>;
  coberturas?: Array<{
    tipo?: string;
    nome?: string;
    valor?: number | string;
    valorCoberto?: number | string;
  }> | Record<string, any>;
  caracteristicas?: Array<{
    nome?: string;
    descricao?: string;
    valor?: any;
  }> | Record<string, any>;
}

// Resposta da API de cotação
export interface UniversalQuoteResponse {
  produtos?: UniversalProduct[];
  planos?: UniversalProduct[];
  beneficios?: UniversalBenefit[];
  message?: string;
  codigoCarrinho?: string;
  codigoCotacao?: string;
  urlVoucher?: string;
  valorBruto?: number;
  valorBrutoBrl?: number;
  valorBrutoUsd?: number;
  [key: string]: any;
}
