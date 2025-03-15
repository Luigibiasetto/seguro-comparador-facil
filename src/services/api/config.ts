
import { ApiConfig } from './types';

// Default API configuration
let apiConfig: ApiConfig = {
  baseUrl: "https://api-br.universal-assistance.com/v1",
  apiKey: "",
  provider: "universal-assist",
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
