
import { ApiConfig } from './types';

// Default API configuration
let apiConfig: ApiConfig = {
  baseUrl: "https://api-br.universal-assistance.com/v1",
  apiKey: "",
  provider: "universal-assist",
  useProxy: true, // Added proxy support
  proxyUrl: "https://corsproxy.io/?", // Default CORS proxy
  providerSettings: {
    username: "raphaelbellei",
    password: "Anthony25"
  },
  headers: {
    'Origin': window.location.origin,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*'
  }
};

// Function to configure the API
export const configureInsuranceAPI = (config: Partial<ApiConfig>) => {
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
  
  console.log("API configurada:", apiConfig);
  return apiConfig;
};

// Getter for the current API configuration
export const getApiConfig = (): ApiConfig => {
  return { ...apiConfig };
};

// Helper function to get URL with or without proxy
export const getApiUrl = (endpoint: string): string => {
  const config = getApiConfig();
  const baseUrl = config.baseUrl;
  const fullUrl = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  if (config.useProxy && config.proxyUrl) {
    return `${config.proxyUrl}${encodeURIComponent(fullUrl)}`;
  }
  
  return fullUrl;
};
