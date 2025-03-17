
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

// Interface para pedidos
export interface Order {
  id?: string;
  user_id: string;
  offer_id: string;
  offer_data: InsuranceOffer;
  provider_id: string;
  provider_data: InsuranceProvider;
  customer_info: CustomerInfo;
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  payment_method: "pix" | "credit_card";
  total_amount: number;
  status: "pending" | "paid" | "cancelled" | "expired";
  created_at?: string;
}

// Interface para cadastro/perfil de usuário
export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  cpf: string; // Novo campo CPF para cadastro
  phone?: string;
  created_at?: string;
}

// Interface para carrinhos abandonados
export interface AbandonedCart {
  id?: string;
  user_id?: string;
  email: string;
  phone: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  passengers: {
    adults: number;
    children: number;
    ages: number[];
    count?: number;
  };
  customer_info?: CustomerInfo;
  offer_data?: InsuranceOffer;
  provider_data?: InsuranceProvider;
  created_at?: string;
  recovered: boolean;
}

// Helper type for Supabase Json fields
export type Json = any;
