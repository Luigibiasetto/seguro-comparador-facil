
// Types for the insurance API
export interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
}

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
    other?: Record<string, number>;
  };
  benefits: string[];
  rating?: number; // Made optional
  recommended: boolean;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: {
    count: number;
    ages: number[];
  };
  phone?: string;
}

export interface CustomerInfo {
  documentType: 'cpf' | 'passport';
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
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface CheckoutData {
  offer: InsuranceOffer;
  provider: InsuranceProvider;
  search: SearchParams;
  customer: CustomerInfo;
  paymentMethod: 'pix' | 'creditCard';
  creditCardInfo?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
}

// API configuration
export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  provider?: string;
  providerSettings?: {
    clientId?: string;
    clientSecret?: string;
    username?: string;
    password?: string;
    endpoint?: string;
  };
  headers?: Record<string, string>; // Added headers property
}
