
import { ApiConfig } from './types';

// Default API configuration
let apiConfig: ApiConfig = {
  baseUrl: "https://api.universal-assistance.com", // Changed from api-br to api
  apiKey: "",
  provider: "universal-assist",
  providerSettings: {
    username: "luigi.biasetto",
    password: "tIMES18"
  }
};

// Function to configure the API
export const configureInsuranceAPI = (config: Partial<ApiConfig>) => {
  apiConfig = { ...apiConfig, ...config };
  
  // Ensure baseUrl doesn't have trailing slashes
  if (apiConfig.baseUrl) {
    apiConfig.baseUrl = apiConfig.baseUrl.replace(/\/+$/, "");
  }
  
  console.log("API configurada:", apiConfig);
  return apiConfig;
};

// Getter for the current API configuration
export const getApiConfig = (): ApiConfig => {
  return { ...apiConfig };
};
