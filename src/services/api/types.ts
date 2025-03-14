
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
  rating: number;
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
}
