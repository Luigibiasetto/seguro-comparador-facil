
import { InsuranceOffer, InsuranceProvider, SearchParams } from "../types";
import { getApiConfig } from "../config";

export const fetchGenericInsuranceOffers = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    const apiConfig = getApiConfig();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add API key if provided
    if (apiConfig.apiKey) {
      headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
    }
    
    // Prepare the data for the insurance API
    const requestData = {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      passengers: params.passengers,
      phone: params.phone || ""
    };
    
    // Make the request to the API
    const response = await fetch(`${apiConfig.baseUrl}/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map the API response to the internal format
    return data.offers.map((apiOffer: any) => ({
      id: apiOffer.id || `offer-${Math.random().toString(36).substring(2, 9)}`,
      providerId: apiOffer.providerId || "unknown",
      name: apiOffer.name || "Plano de Seguro",
      price: apiOffer.price || 0,
      coverage: {
        medical: apiOffer.coverage?.medical || 0,
        baggage: apiOffer.coverage?.baggage || 0,
        cancellation: apiOffer.coverage?.cancellation || 0,
        delay: apiOffer.coverage?.delay || 0,
        other: apiOffer.coverage?.other || undefined,
      },
      benefits: apiOffer.benefits || [],
      rating: apiOffer.rating || 3.5,
      recommended: apiOffer.recommended || false,
    }));
  } catch (error) {
    console.error("Erro ao buscar dados da API de seguros:", error);
    throw error;
  }
};

export const fetchGenericProviders = async (): Promise<InsuranceProvider[]> => {
  try {
    const apiConfig = getApiConfig();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiConfig.apiKey) {
      headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
    }
    
    const response = await fetch(`${apiConfig.baseUrl}/providers`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map the API response to the internal format
    return data.providers.map((apiProvider: any) => ({
      id: apiProvider.id || `provider-${Math.random().toString(36).substring(2, 9)}`,
      name: apiProvider.name || "Seguradora",
      logo: apiProvider.logo || "/placeholder.svg",
    }));
  } catch (error) {
    console.error("Erro ao buscar provedores de seguros:", error);
    throw error;
  }
};
