
import { ApiConfig } from './types';

// Default API configuration
let apiConfig: ApiConfig = {
  baseUrl: "https://api-br.universal-assistance.com/v1",
  apiKey: "",
  provider: "universal-assist",
  useProxy: true,
  proxyUrl: "https://api.allorigins.win/raw?url=", // Updated default CORS proxy
  debugMode: true,
  useSupabase: true, // Nova opção para usar Supabase Edge Function
  fallbackProxies: [
    "https://api.allorigins.win/raw?url=",
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
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
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
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };
  
  console.log("API configurada:", apiConfig);
  
  if (apiConfig.debugMode) {
    console.log("Origem atual:", window.location.origin);
    console.log("API base URL:", apiConfig.baseUrl);
    console.log("Usando proxy:", apiConfig.useProxy ? "Sim" : "Não");
    console.log("Usando Supabase:", apiConfig.useSupabase ? "Sim" : "Não");
    if (apiConfig.useProxy) {
      console.log("URL do proxy:", apiConfig.proxyUrl);
    }
  }
  
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
    const encodedUrl = encodeURIComponent(fullUrl);
    const finalUrl = `${proxyUrl}${encodedUrl}`;
    
    if (config.debugMode) {
      console.log(`URL com proxy: ${finalUrl}`);
    }
    
    return finalUrl;
  }
  
  if (config.debugMode) {
    console.log(`URL direta: ${fullUrl}`);
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
    const result = await fetchFunction(config.proxyUrl);
    if (config.debugMode) {
      console.log(`Conexão bem-sucedida com proxy primário: ${config.proxyUrl}`);
    }
    return result;
  } catch (error) {
    console.warn(`Falha ao usar proxy primário ${config.proxyUrl}:`, error);
    
    // Try each fallback proxy
    if (config.fallbackProxies && config.fallbackProxies.length > 0) {
      const uniqueProxies = [...new Set([...config.fallbackProxies])];
      
      for (const proxy of uniqueProxies) {
        if (proxy === config.proxyUrl) continue; // Skip if it's the same as the primary
        
        try {
          console.log(`Tentando proxy alternativo: ${proxy}`);
          const result = await fetchFunction(proxy);
          console.log(`Conexão bem-sucedida com proxy alternativo: ${proxy}`);
          return result;
        } catch (proxyError) {
          console.warn(`Falha ao usar proxy alternativo ${proxy}:`, proxyError);
        }
      }
    }
    
    // If all proxies failed, throw the original error
    throw error;
  }
};
