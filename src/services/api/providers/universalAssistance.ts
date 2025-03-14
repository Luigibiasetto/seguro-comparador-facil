
import { toast } from "sonner";
import { getApiConfig } from "../config";
import { calculateTripDuration } from "../utils";
import { InsuranceOffer, SearchParams } from "../types";

export const fetchUniversalAssistanceOffers = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    console.log("Iniciando busca de dados da Universal Assistance");
    const apiConfig = getApiConfig();
    console.log("Configuração da API:", apiConfig);
    
    if (!apiConfig.providerSettings?.username || !apiConfig.providerSettings?.password) {
      throw new Error("Credenciais da Universal Assistance não configuradas corretamente");
    }

    // First authenticate to get the token
    console.log("Tentando autenticação com a Universal Assistance...");
    const authResponse = await fetch(`${apiConfig.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: apiConfig.providerSettings.username,
        password: apiConfig.providerSettings.password
      })
    });

    console.log("Status da resposta de autenticação:", authResponse.status);
    
    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error("Erro na resposta de autenticação:", errorText);
      throw new Error(`Erro na autenticação com a Universal Assistance: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    console.log("Resposta de autenticação:", authData);
    
    const token = authData.token || authData.access_token;

    if (!token) {
      console.error("Token não encontrado na resposta:", authData);
      throw new Error("Token de autenticação não recebido");
    }

    console.log("Token obtido com sucesso");

    // Calculate the trip duration in days
    const tripDuration = calculateTripDuration(params.departureDate, params.returnDate);

    // Format dates in the pattern accepted by the API (YYYY-MM-DD)
    const departureFormatted = new Date(params.departureDate).toISOString().split('T')[0];
    const returnFormatted = new Date(params.returnDate).toISOString().split('T')[0];

    // Use origin and destination codes sent by the searcher
    const originCode = params.origin; // BR or INT-BR
    const destinationCode = params.destination; // NAMERICA, SAMERICA, EUROPE, etc.

    console.log("Parâmetros formatados:", {
      origin: originCode,
      destination: destinationCode,
      departure: departureFormatted,
      return: returnFormatted,
      duration: tripDuration,
      passengers: params.passengers.ages
    });

    // Prepare the data for insurance search
    const searchData = {
      origin: originCode,
      destination: destinationCode,
      departure_date: departureFormatted,
      return_date: returnFormatted,
      trip_duration: tripDuration,
      passengers: params.passengers.ages.map(age => ({ age })),
      contact: {
        phone: params.phone || ""
      }
    };

    console.log("Enviando requisição para busca de planos:", searchData);
    console.log("URL da requisição:", `${apiConfig.baseUrl}/plans/search`);

    // Make the request to search for plans
    const response = await fetch(`${apiConfig.baseUrl}/plans/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(searchData)
    });

    console.log("Status da resposta de busca:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta de busca:", errorText);
      throw new Error(`Erro na busca de planos: ${response.status}`);
    }

    const data = await response.json();
    console.log("Resposta de busca de planos:", data);

    // Check if the response contains plans
    if (!data.plans || !Array.isArray(data.plans) || data.plans.length === 0) {
      console.warn("Nenhum plano retornado na resposta");
      return [];
    }

    // Map the Universal Assistance response to the internal format
    return data.plans.map((plan: any) => ({
      id: plan.id || `universal-${Math.random().toString(36).substring(2, 9)}`,
      providerId: "universal-assist",
      name: plan.name || "Plano Universal Assistance",
      price: plan.price || 0,
      coverage: {
        medical: plan.coverages?.medical || 0,
        baggage: plan.coverages?.baggage || 0,
        cancellation: plan.coverages?.cancellation || 0,
        delay: plan.coverages?.delay || 0,
        other: plan.coverages?.other || undefined,
      },
      benefits: Array.isArray(plan.benefits) ? plan.benefits.map((b: any) => (typeof b === 'string' ? b : (b.name || ''))) : [],
      rating: plan.rating || 4.5,
      recommended: plan.recommended || false,
    }));
  } catch (error) {
    console.error("Erro ao buscar dados da Universal Assistance:", error);
    toast.error("Erro ao buscar dados da Universal Assistance. Verifique suas credenciais e tente novamente.");
    // Return empty array in case of error to avoid breaking the application
    return [];
  }
};
