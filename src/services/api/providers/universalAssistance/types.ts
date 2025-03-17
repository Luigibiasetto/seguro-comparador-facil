
import { InsuranceOffer, SearchParams } from "../../types";

// Tipos para os benefícios
export interface UniversalBenefit {
  id: number;
  nome: string;
  descricao: string;
  idIdioma?: number;
  icone?: string;
}

// Tipos para as classificações
export interface UniversalClassification {
  id: number;
  descricao: string;
}

// Tipos para os tipos de viagem
export interface UniversalTripType {
  id: number;
  descricao: string;
}

// Tipos para as operadoras (bandeiras de cartão)
export interface UniversalCardOperator {
  id: number;
  nome: string;
  ativo: boolean;
}

// Tipos para os tipos de documentos
export interface UniversalDocumentType {
  id: number;
  descricao: string;
}

// Tipos para os tipos de tarifa
export interface UniversalTariffType {
  id: number;
  descricao: string;
}

// Tipos para os destinos
export interface UniversalDestination {
  id: number;
  codigo: string;
  nome: string;
  ativo: boolean;
}

// Tipos para os países/passaportes
export interface UniversalPassportCountry {
  id: number;
  nome: string;
  codigo: string;
}

// Tipos para as moedas
export interface UniversalCurrency {
  id: number;
  nome: string;
  codigo: string;
  simbolo: string;
}

// Tipos para as vendas
export interface UniversalSale {
  id: string;
  dataEmissao: string;
  cliente: string;
  destino: string;
  dataViagem: string;
  valorTotal: number;
  status: string;
}

// Interface para o payload de cotação
export interface UniversalQuotePayload {
  destinos: string[];
  passageiros: {
    nome: string;
    dataNascimento: string;
  }[];
  dataSaida: string;
  dataRetorno: string;
  tipoViagem: number;
  tipoTarifa: number;
  produtoAvulso: boolean;
  cupom: string;
  classificacoes: number[];
}

// Interface para o produto/plano retornado na cotação
export interface UniversalProduct {
  id: string;
  codigo?: string;
  nome: string;
  descricao?: string;
  preco: number;
  valorBruto?: number;
  coberturas?: Array<{
    tipo?: string;
    nome?: string;
    valor?: number;
    valorCoberto?: number;
  }> | Record<string, any>;
  beneficios?: Array<UniversalBenefit | string> | Record<string, any>;
  caracteristicas?: Array<{
    nome?: string;
    descricao?: string;
  }> | string[];
}

// Interface para a resposta da cotação
export interface UniversalQuoteResponse {
  produtos?: UniversalProduct[];
  planos?: UniversalProduct[];
  codigoCarrinho?: string;
  codigoCotacao?: string;
  urlVoucher?: string;
  valorBruto?: number;
  moeda?: string;
}

// Tipo de função para transformar produtos da API em ofertas do sistema
export type ProductToOfferConverter = (products: UniversalProduct[]) => InsuranceOffer[];
