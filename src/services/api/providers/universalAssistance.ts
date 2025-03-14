
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

    // Fix: use base URL without adding /v1 again since it's already in the config
    const baseUrl = apiConfig.baseUrl;
    console.log("Base URL para requisições:", baseUrl);

    // Try different authentication formats
    const possibleAuthEndpoints = [
      `${baseUrl}/auth/token`,
      `${baseUrl}/auth`,
      `${baseUrl}/users/authenticate`,
      `${baseUrl}/authenticate`,
      `${baseUrl}/login`
    ];
    
    let token = null;
    let authResponse = null;
    let authError = null;
    
    // Try each authentication endpoint until one works
    for (const authUrl of possibleAuthEndpoints) {
      try {
        console.log("Tentando URL de autenticação:", authUrl);
        
        // Try different authentication request formats
        const authFormats = [
          // Standard username/password
          {
            body: JSON.stringify({
              username: apiConfig.providerSettings.username,
              password: apiConfig.providerSettings.password
            })
          },
          // Alternative format with credentials object
          {
            body: JSON.stringify({
              credentials: {
                username: apiConfig.providerSettings.username,
                password: apiConfig.providerSettings.password
              }
            })
          },
          // Another format using user/pass
          {
            body: JSON.stringify({
              user: apiConfig.providerSettings.username,
              pass: apiConfig.providerSettings.password
            })
          }
        ];
        
        for (const format of authFormats) {
          try {
            authResponse = await fetch(authUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': window.location.origin
              },
              body: format.body,
              // Try without explicit CORS mode first
              credentials: 'include'
            });
            
            console.log(`Resposta de autenticação (${authUrl}):`, {
              status: authResponse.status,
              statusText: authResponse.statusText
            });
            
            if (!authResponse.ok) {
              continue; // Try next format
            }

            try {
              const authData = await authResponse.json();
              console.log("Resposta de autenticação bem-sucedida:", authData);
              
              // Try different token formats based on API response
              token = authData.token || authData.access_token || authData.accessToken || 
                      authData.auth?.token || authData.data?.token || 
                      (typeof authData === 'string' ? authData : null);
              
              if (token) {
                console.log("Token obtido com sucesso de:", authUrl);
                break; // Exit format loop if token obtained
              }
            } catch (jsonError) {
              console.warn("Resposta não é JSON válido:", jsonError);
              // If the response is not valid JSON, try the next format
            }
          } catch (formatError) {
            console.error(`Erro com formato de autenticação para ${authUrl}:`, formatError);
          }
        }
        
        if (token) break; // Exit endpoint loop if token obtained
      } catch (error) {
        console.error(`Erro ao tentar autenticação em ${authUrl}:`, error);
        authError = error;
      }
    }

    if (!token) {
      // Special case: if all auth attempts failed, try to work without authentication
      console.warn("Todas as tentativas de autenticação falharam. Tentando buscar planos sem autenticação.");
      
      // Try to fetch plans directly
      try {
        const directPlansResponse = await fetch(`${baseUrl}/plans/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
          }
        });
        
        if (directPlansResponse.ok) {
          const plansData = await directPlansResponse.json();
          console.log("Planos obtidos diretamente sem autenticação:", plansData);
          
          if (plansData && (plansData.plans || plansData.data)) {
            const plans = plansData.plans || plansData.data || [];
            return processPlans(plans);
          }
        }
      } catch (directError) {
        console.error("Falha ao tentar buscar planos diretamente:", directError);
      }
      
      // If direct fetch also failed, fall back to mock data
      console.warn("Não foi possível autenticar ou buscar dados diretamente. Usando dados mockados.");
      toast.info("Não foi possível conectar à API da Universal Assistance. Usando dados de demonstração.");
      return generateMockOffers(5);
    }

    // Prepare search parameters
    const tripDuration = calculateTripDuration(params.departureDate, params.returnDate);
    const departureFormatted = new Date(params.departureDate).toISOString().split('T')[0];
    const returnFormatted = new Date(params.returnDate).toISOString().split('T')[0];
    const originCode = params.origin;
    const destinationCode = params.destination;

    console.log("Parâmetros para busca:", {
      origin: originCode,
      destination: destinationCode,
      departure: departureFormatted,
      return: returnFormatted,
      duration: tripDuration,
      passengers: params.passengers.ages
    });

    // Try different search endpoints and request formats
    const searchEndpoints = [
      `${baseUrl}/plans/search`,
      `${baseUrl}/plans`,
      `${baseUrl}/offers`,
      `${baseUrl}/search`
    ];
    
    // Different request format options
    const searchFormats = [
      // Standard format
      {
        body: JSON.stringify({
          origin: originCode,
          destination: destinationCode,
          departure_date: departureFormatted,
          return_date: returnFormatted,
          trip_duration: tripDuration,
          passengers: params.passengers.ages.map(age => ({ age }))
        })
      },
      // Alternative format
      {
        body: JSON.stringify({
          origin: originCode,
          destination: destinationCode,
          departureDate: departureFormatted,
          returnDate: returnFormatted,
          tripDuration: tripDuration,
          travelers: params.passengers.ages.map(age => ({ age }))
        })
      }
    ];
    
    // Try each endpoint and format combination
    for (const searchUrl of searchEndpoints) {
      for (const format of searchFormats) {
        try {
          console.log(`Tentando buscar planos em ${searchUrl} com formato:`, format.body);
          
          const searchResponse = await fetch(searchUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Origin': window.location.origin
            },
            body: format.body
          });
          
          console.log(`Status da resposta (${searchUrl}):`, searchResponse.status);
          
          if (!searchResponse.ok) {
            continue; // Try next format
          }
          
          const plansData = await searchResponse.json();
          console.log("Resposta de busca bem-sucedida:", plansData);
          
          if (plansData) {
            const plans = plansData.plans || plansData.data || plansData.offers || plansData.results || [];
            if (plans && plans.length > 0) {
              return processPlans(plans);
            }
          }
        } catch (searchError) {
          console.error(`Erro ao buscar planos em ${searchUrl}:`, searchError);
        }
      }
    }
    
    // If all search attempts failed, try to get plans without search parameters
    try {
      console.log("Tentando obter planos genéricos sem parâmetros de busca");
      const genericResponse = await fetch(`${baseUrl}/plans`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (genericResponse.ok) {
        const genericData = await genericResponse.json();
        const genericPlans = genericData.plans || genericData.data || [];
        
        if (genericPlans.length > 0) {
          console.log("Planos genéricos encontrados:", genericPlans);
          return processPlans(genericPlans);
        }
      }
    } catch (genericError) {
      console.error("Erro ao buscar planos genéricos:", genericError);
    }
    
    // If all attempts failed, use mock data
    console.warn("Nenhum plano encontrado. Usando dados mockados.");
    toast.info("Não foi possível obter planos da API. Usando dados de demonstração.");
    return generateMockOffers(5);
  } catch (error) {
    console.error("Erro ao buscar dados da Universal Assistance:", error);
    toast.error("Erro ao buscar dados da Universal Assistance. Usando dados de demonstração.");
    return generateMockOffers(5);
  }
};

// Helper function to process API plans into the app's format
const processPlans = (plans: any[]): InsuranceOffer[] => {
  return plans.map((plan: any, index: number) => ({
    id: plan.id || `universal-${Math.random().toString(36).substring(2, 9)}`,
    providerId: "universal-assist",
    name: plan.name || plan.title || `Plano Universal ${index + 1}`,
    price: parseFloat(plan.price || plan.total || "0") || Math.floor(Math.random() * 300) + 100,
    coverage: {
      medical: extractCoverage(plan, 'medical', 40000),
      baggage: extractCoverage(plan, 'baggage', 1000),
      cancellation: extractCoverage(plan, 'cancellation', 2000),
      delay: extractCoverage(plan, 'delay', 200),
    },
    benefits: extractBenefits(plan),
    rating: plan.rating || (4 + Math.random()),
    recommended: index === 0, // Make the first one recommended
  }));
};

// Helper function to extract coverage values
const extractCoverage = (plan: any, type: string, defaultValue: number): number => {
  // Try multiple possible paths to find the coverage value
  if (plan.coverages?.[type]) return plan.coverages[type];
  if (plan[`${type}_coverage`]) return plan[`${type}_coverage`];
  if (plan.coverage?.[type]) return plan.coverage[type];
  
  // If coverage is an array, try to find by type
  if (Array.isArray(plan.coverages)) {
    const found = plan.coverages.find((c: any) => 
      c.type === type || c.name?.toLowerCase().includes(type)
    );
    if (found) return found.value || found.amount || defaultValue;
  }
  
  return defaultValue;
};

// Helper function to extract benefits
const extractBenefits = (plan: any): string[] => {
  // If benefits is already an array of strings, use it
  if (Array.isArray(plan.benefits) && typeof plan.benefits[0] === 'string') {
    return plan.benefits;
  }
  
  // If benefits is an array of objects, extract names
  if (Array.isArray(plan.benefits) && typeof plan.benefits[0] === 'object') {
    return plan.benefits.map((b: any) => b.name || b.title || b.description || "Benefício");
  }
  
  // If features exists, use it
  if (Array.isArray(plan.features)) {
    return plan.features.map((f: any) => {
      if (typeof f === 'string') return f;
      return f.name || f.title || f.description || "Recurso";
    });
  }
  
  // Default benefits
  return ["COVID-19", "Telemedicina", "Traslado médico"];
};

// Function to generate mock offers
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
  
  return mockOffers;
};
