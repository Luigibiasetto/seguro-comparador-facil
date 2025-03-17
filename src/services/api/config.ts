
import { ApiConfig } from './types';

// Default API configuration
let apiConfig: ApiConfig = {
  baseUrl: "https://api-br.universal-assistance.com/v1",
  apiKey: "",
  provider: "universal-assist",
  useProxy: false,
  proxyUrl: "",
  debugMode: false,
  useSupabase: false,
  fallbackProxies: [],
  providerSettings: {
    username: "raphaelbellei",
    password: "Anthony25"
  },
  headers: {
    'Origin': window.location.origin,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
};

// Function to configure the API
export const configureInsuranceAPI = (config: Partial<ApiConfig>) => {
  console.log("Configurando API com:", config);
  
  apiConfig = { ...apiConfig, ...config };
  
  // Ensure baseUrl doesn't have trailing slashes
  if (apiConfig.baseUrl) {
    apiConfig.baseUrl = apiConfig.baseUrl.replace(/\/+$/, "");
  }
  
  // Ensure headers are properly set
  if (!apiConfig.headers) {
    apiConfig.headers = {};
  }
  
  // Set critical headers for API requests
  apiConfig.headers = {
    ...apiConfig.headers,
    'Origin': window.location.origin,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  };
  
  console.log("Configuração final da API:", apiConfig);
  
  return apiConfig;
};

// Getter for the current API configuration
export const getApiConfig = (): ApiConfig => {
  return { ...apiConfig };
};

// Helper function to get URL without proxy
export const getApiUrl = (endpoint: string): string => {
  const config = getApiConfig();
  const baseUrl = config.baseUrl;
  const fullUrl = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  console.log(`Gerando URL para endpoint ${endpoint}: ${fullUrl}`);
  
  return fullUrl;
};
