
// Tipos para a configuração da API
export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  provider: string;
  useProxy: boolean;
  proxyUrl?: string;
  debugMode: boolean;
  useSupabase?: boolean; // Nova opção
  fallbackProxies?: string[];
  providerSettings?: {
    username?: string;
    password?: string;
  };
  headers?: Record<string, string>;
}

// Tipo para parâmetros de busca
export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: {
    adults: number;
    children: number;
    ages: number[];
  };
}

// Tipo para uma oferta de seguro
export interface InsuranceOffer {
  id: string;
  providerId: string;
  name: string;
  price: number;
  coverage: {
    medical: number;
    baggage: number;
    cancellation: number;
    delay: number;
  };
  benefits: string[];
  rating: number;
  recommended: boolean;
}

// Tipo para um provedor de seguros
export interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
}
