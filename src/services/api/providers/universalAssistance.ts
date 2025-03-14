
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

    // Remove trailing slashes from baseUrl if present
    const baseUrl = apiConfig.baseUrl.replace(/\/+$/, "");
    console.log("Base URL normalizada:", baseUrl);

    // First authenticate to get the token
    console.log("Tentando autenticação com a Universal Assistance...");
    
    // Updated authentication endpoint
    const authUrl = `${baseUrl}/auth/login`;
    console.log("URL de autenticação:", authUrl);
    
    try {
      const authResponse = await fetch(authUrl, {
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
      
      const token = authData.token || authData.access_token || authData.accessToken;

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

      // Updated search endpoint
      const searchUrl = `${baseUrl}/api/plans`;
      console.log("Enviando requisição para busca de planos:", searchData);
      console.log("URL da requisição:", searchUrl);

      try {
        // Make the request to search for plans
        const response = await fetch(searchUrl, {
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
        const plans = data.plans || data.results || data.data || [];
        
        if (!plans || !Array.isArray(plans) || plans.length === 0) {
          console.warn("Nenhum plano retornado na resposta");
          return generateMockOffers(3); // Return mock data if no plans are returned
        }

        // Map the Universal Assistance response to the internal format
        return plans.map((plan: any) => ({
          id: plan.id || `universal-${Math.random().toString(36).substring(2, 9)}`,
          providerId: "universal-assist",
          name: plan.name || plan.title || "Plano Universal Assistance",
          price: parseFloat(plan.price) || Math.floor(Math.random() * 300) + 100,
          coverage: {
            medical: plan.coverages?.medical || plan.medical_coverage || Math.floor(Math.random() * 80000) + 20000,
            baggage: plan.coverages?.baggage || plan.baggage_coverage || Math.floor(Math.random() * 1500) + 500,
            cancellation: plan.coverages?.cancellation || plan.cancellation_coverage || Math.floor(Math.random() * 3000) + 1000,
            delay: plan.coverages?.delay || plan.delay_coverage || Math.floor(Math.random() * 300) + 100,
          },
          benefits: Array.isArray(plan.benefits) 
            ? plan.benefits.map((b: any) => (typeof b === 'string' ? b : (b.name || ''))) 
            : ["COVID-19", "Telemedicina", "Traslado médico"],
          rating: plan.rating || 4.5,
          recommended: plan.recommended || false,
        }));
      } catch (searchError) {
        console.error("Erro na busca de planos:", searchError);
        return generateMockOffers(3); // Return mock data on search error
      }
    } catch (authError) {
      console.error("Erro na autenticação:", authError);
      return generateMockOffers(4); // Return mock data on auth error
    }
  } catch (error) {
    console.error("Erro ao buscar dados da Universal Assistance:", error);
    toast.error("Erro ao buscar dados da Universal Assistance. Verifique suas credenciais e tente novamente.");
    // Return mock data in case of error to avoid breaking the application
    return generateMockOffers(5);
  }
};

// Helper function to generate mock offers with different prices/coverage
const generateMockOffers = (count: number): InsuranceOffer[] => {
  const mockOffers: InsuranceOffer[] = [];
  
  const planNames = [
    "Plano Essencial", 
    "Plano Premium", 
    "Plano Executivo", 
    "Plano Familiar", 
    "Plano Standard"
  ];
  
  const benefits = [
    ["COVID-19", "Telemedicina", "Traslado médico"],
    ["COVID-19", "Telemedicina", "Traslado médico", "Esportes aventura"],
    ["COVID-19", "Telemedicina", "Traslado médico", "Esportes aventura", "Gestantes"],
    ["COVID-19", "Telemedicina", "Traslado médico", "Repatriação"]
  ];
  
  for (let i = 0; i < count; i++) {
    const price = Math.floor(Math.random() * 300) + 100; // 100-400
    const medicalCoverage = Math.floor(Math.random() * 80000) + 20000; // 20000-100000
    
    mockOffers.push({
      id: `universal-mock-${i}`,
      providerId: "universal-assist",
      name: planNames[i % planNames.length],
      price: price,
      coverage: {
        medical: medicalCoverage,
        baggage: Math.floor(price * 5),
        cancellation: Math.floor(price * 10),
        delay: Math.floor(price * 0.8)
      },
      benefits: benefits[i % benefits.length],
      rating: 4 + Math.random(),
      recommended: i === 0, // Make the first one recommended
    });
  }
  
  console.log("Gerando ofertas mockadas:", mockOffers);
  toast.info("Usando dados de demonstração pois não foi possível conectar à API.");
  
  return mockOffers;
};
