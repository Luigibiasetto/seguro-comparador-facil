
// Interfaces for Universal Assistance API

// Benefit interface
export interface UniversalBenefit {
  codigo: number;
  nome: string;
  descricao?: string;
  isNacional?: boolean;
  idioma?: number;
  valor?: string | number;
  valorCoberto?: string | number;
}

// Classification interface
export interface UniversalClassification {
  codigo: number;
  descricao: string;
}

// Trip type interface
export interface UniversalTripType {
  codigoTipoViagem: number;
  tipo: string;
}

// Card operator interface
export interface UniversalCardOperator {
  codigoOperadora: number;
  nome: string;
}

// Document type interface
export interface UniversalDocumentType {
  codigoTipo: number;
  descricao: string;
}

// Tariff type interface
export interface UniversalTariffType {
  codigo: number;
  nome: string;
}

// Destination interface
export interface UniversalDestination {
  codigo: string;
  nome: string;
  isNacional: boolean;
}

// Passport country interface
export interface UniversalPassportCountry {
  codigo: string;
  nome: string;
}

// Currency interface
export interface UniversalCurrency {
  codigo: string;
  nome: string;
  simbolo: string;
}

// Sale interface
export interface UniversalSale {
  codigoCarrinho: string;
  bilhete?: string;
  dataSaida: string;
  dataRetorno: string;
  dataEmissao: string;
  titular: string;
  destino: string;
  valorBrutoBrl?: number;
  valorBrutoUsd?: number;
}

// Passenger interface
export interface UniversalPassenger {
  nome: string;
  dataNascimento: string;
}

// Quote payload interface
export interface UniversalQuotePayload {
  destinos: string[];
  passageiros: UniversalPassenger[];
  dataSaida: string;
  dataRetorno: string;
  tipoViagem: number;
  tipoTarifa: number;
  produtoAvulso: boolean;
  cupom: string;
  classificacoes: number[];
}

// Product interface for quote responses
export interface UniversalProduct {
  codigo: string;
  nome: string;
  descricao?: string;
  preco: number;
  valorBrutoBrl?: number;
  valorBrutoUsd?: number;
  valorEmDinheiro?: number;
  coberturas?: any;
  beneficios?: any[];
  caracteristicas?: any[];
}

// Quote response interface
export interface UniversalQuoteResponse {
  codigoCarrinho?: string;
  codigoCotacao?: string;
  urlVoucher?: string;
  valorBrutoBrl?: number;
  valorBrutoUsd?: number;
  produtos?: UniversalProduct[];
  planos?: UniversalProduct[];
  message?: string;
  beneficios?: any[];
}
