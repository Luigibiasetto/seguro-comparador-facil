
import { getApiConfig, getApiUrl } from "../../config";

// Function to get authentication headers
export const getUniversalHeaders = () => {
  const apiConfig = getApiConfig();
  
  if (!apiConfig.providerSettings?.username || !apiConfig.providerSettings?.password) {
    throw new Error("Credenciais da Universal Assistance não configuradas corretamente");
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Login': apiConfig.providerSettings.username,
    'Senha': apiConfig.providerSettings.password,
    'Origin': window.location.origin
  };
};

// Generic GET request function
export const fetchUniversalGet = async <T>(endpoint: string): Promise<T> => {
  const headers = getUniversalHeaders();
  const url = getApiUrl(endpoint);
  
  console.log(`Fazendo requisição GET para: ${url}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro na requisição GET ${endpoint}:`, errorText);
    throw new Error(`Falha na requisição GET ${endpoint}: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return data as T;
};

// Generic POST request function
export const fetchUniversalPost = async <T>(endpoint: string, payload: any): Promise<T> => {
  const headers = getUniversalHeaders();
  const url = getApiUrl(endpoint);
  
  console.log(`Fazendo requisição POST para: ${url}`);
  console.log('Payload:', payload);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro na requisição POST ${endpoint}:`, errorText);
    throw new Error(`Falha na requisição POST ${endpoint}: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return data as T;
};

// Generic PUT request function
export const fetchUniversalPut = async <T>(endpoint: string, payload: any): Promise<T> => {
  const headers = getUniversalHeaders();
  const url = getApiUrl(endpoint);
  
  console.log(`Fazendo requisição PUT para: ${url}`);
  console.log('Payload:', payload);
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro na requisição PUT ${endpoint}:`, errorText);
    throw new Error(`Falha na requisição PUT ${endpoint}: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return data as T;
};

// Helper function to convert destination to code format expected by API
export function getDestinationCode(destination: string): string {
  const destinationMap: Record<string, string> = {
    "NAMERICA": "NA", // América do Norte
    "SAMERICA": "SA", // América do Sul
    "EUROPE": "EU",   // Europa
    "ASIA": "AS",     // Ásia
    "AFRICA": "AF",   // África
    "OCEANIA": "OC",  // Oceania
    "BR": "BR"        // Brasil
  };
  
  return destinationMap[destination] || destination;
}

// Helper function to calculate birth date based on age
export function calculateBirthDate(age: number): string {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  return `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}
