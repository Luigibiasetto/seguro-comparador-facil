
import { ApiConfig } from './types';

// Default API configuration
let apiConfig: ApiConfig = {
  baseUrl: "https://api-br.universal-assistance.com/v1",
  apiKey: "",
  provider: "universal-assist",
  useProxy: true, // Added proxy support
  proxyUrl: "https://corsproxy.io/?", // Default CORS proxy
  fallbackProxies: [
    "https://corsproxy.io/?",
    "https://cors-proxy.htmldriven.com/?url=",
    "https://cors.bridged.cc/",
    "https://proxy.cors.sh/"
  ],
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
export const getApiUrl = (endpoint: string, proxyOverride?: string): string => {
  const config = getApiConfig();
  const baseUrl = config.baseUrl;
  const fullUrl = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  if (config.useProxy) {
    // Use specified proxy or default
    const proxyUrl = proxyOverride || config.proxyUrl;
    return `${proxyUrl}${encodeURIComponent(fullUrl)}`;
  }
  
  return fullUrl;
};

// Helper function to try multiple proxies
export const tryWithMultipleProxies = async <T>(
  fetchFunction: (proxyUrl: string) => Promise<T>
): Promise<T> => {
  const config = getApiConfig();
  
  if (!config.useProxy) {
    // If proxy is disabled, just try the direct call
    return fetchFunction("");
  }
  
  // First try with the configured proxy
  try {
    return await fetchFunction(config.proxyUrl);
  } catch (error) {
    console.warn(`Falha ao usar proxy primário ${config.proxyUrl}:`, error);
    
    // Try each fallback proxy
    if (config.fallbackProxies && config.fallbackProxies.length > 0) {
      for (const proxy of config.fallbackProxies) {
        if (proxy === config.proxyUrl) continue; // Skip if it's the same as the primary
        
        try {
          console.log(`Tentando proxy alternativo: ${proxy}`);
          return await fetchFunction(proxy);
        } catch (proxyError) {
          console.warn(`Falha ao usar proxy alternativo ${proxy}:`, proxyError);
        }
      }
    }
    
    // If all proxies failed, throw the original error
    throw error;
  }
};
