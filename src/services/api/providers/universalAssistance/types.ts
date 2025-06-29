
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

// Exchange rate interface
export interface UniversalExchangeRate {
  taxaCambio: number;
  moedaOrigem: string;
  moedaDestino: string;
  data: string;
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
  documento?: string;
  tipoDocumento?: number;
  email?: string;
  telefone?: string;
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
  valorTotalPacote?: number;
  codigoOperacao?: number;
  canalDeVenda?: number;
  login?: string;
  senha?: string;
  multiviagem?: boolean;
  idCotacao?: number;
}

// Product interface for quote responses
export interface UniversalProduct {
  codigo: string;
  nome: string;
  descricao?: string;
  preco: number | string;
  valorBrutoBrl?: number | string;
  valorBrutoUsd?: number | string;
  valorTotalBrl?: number | string;
  valorEmDinheiro?: number | string;
  moedaOrigem?: string; // Added the missing property
  coberturas?: UniversalProductCoverage[] | Record<string, UniversalProductCoverage>;
  beneficios?: UniversalBenefit[];
  caracteristicas?: any[];
  // Campos específicos para coberturas que podem aparecer
  coberturaMedical?: string | number;
  coberturaBaggage?: string | number;
  coberturaCancellation?: string | number;
  coberturaDelay?: string | number;
}

// Product coverage interface
export interface UniversalProductCoverage {
  tipo?: string;
  nome?: string;
  valor?: number | string;
  valorCoberto?: number | string;
  descricao?: string;
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
  beneficios?: UniversalBenefit[];
}

// Purchase payload interface
export interface UniversalPurchasePayload {
  codigoCarrinho: string;
  passageiros: UniversalPassenger[];
  pagamento: {
    formaPagamento: number;
    parcelas: number;
    valor: number;
    codigoOperadora?: number;
    dadosCartao?: {
      numero: string;
      validade: string;
      cvv: string;
      titular: string;
    };
  };
}

// Purchase response interface
export interface UniversalPurchaseResponse {
  codigoVenda: string;
  bilhete: string;
  urlVoucher: string;
  status: string;
  message?: string;
}

// Voucher interface
export interface UniversalVoucher {
  url: string;
}
