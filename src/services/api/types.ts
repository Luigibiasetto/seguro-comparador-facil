
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
    count?: number; // Added for backward compatibility
  };
  phone: string; // Agora obrigatório (removido o ?)
  email: string; // Novo campo obrigatório
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
    other?: any; // Added other property that may be used
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

// Customer Information type for checkout
export interface CustomerInfo {
  documentType: "cpf" | "passport";
  documentNumber: string;
  fullName: string;
  birthDate: string;
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    country: string;
  };
}

// Interface para leads adaptada para corresponder à estrutura da tabela do Supabase
export interface Lead {
  id?: string;
  email: string;
  phone: string;
  origin: string;
  destination: string;
  // Campos usados no frontend
  departureDate?: Date | string; 
  returnDate?: Date | string;
  // Campos usados no banco (snake_case)
  departure_date?: string;
  return_date?: string;
  passengers: {
    adults: number;
    children: number;
    ages: number[];
    count?: number;
  };
  created_at?: Date | string;
}
