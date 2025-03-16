
import { toast } from "sonner";
import { getApiConfig, getApiUrl } from "../config";
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

    const baseUrl = apiConfig.baseUrl;
    console.log("Base URL para requisições:", baseUrl);
    console.log("Usando proxy:", apiConfig.useProxy ? "Sim" : "Não");
    if (apiConfig.useProxy) {
      console.log("URL do proxy:", apiConfig.proxyUrl);
    }

    // Configurar headers padrão para todas as requisições
    const headers = {
      ...(apiConfig.headers || {}),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin,
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Realizar autenticação via Basic Auth
    const username = apiConfig.providerSettings.username;
    const password = apiConfig.providerSettings.password;
    
    console.log("Tentando autenticação com Basic Auth:", { username });
    const basicAuth = btoa(`${username}:${password}`);
    const authHeaders = {
      ...headers,
      'Authorization': `Basic ${basicAuth}`
    };

    // Realizar requisição de autenticação
    const authUrl = getApiUrl('/auth/token');
    console.log(`Tentando autenticação em: ${authUrl}`);
    
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: authHeaders,
      mode: 'cors'
    });

    let token = null;
    
    if (authResponse.ok) {
      console.log("Resposta de autenticação:", authResponse);
      console.log("Status:", authResponse.status);
      
      try {
        const responseData = await authResponse.json();
        console.log("Dados de autenticação:", responseData);
        
        // Extrair token de diferentes formatos de resposta
        token = responseData.token || 
                responseData.access_token || 
                responseData.accessToken || 
                (responseData.data && responseData.data.token);
                
        if (token) {
          console.log("Token obtido:", token);
        }
      } catch (jsonError) {
        console.warn("Erro ao processar JSON:", jsonError);
        const textResponse = await authResponse.text();
        console.log("Resposta como texto:", textResponse);
        if (textResponse && /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(textResponse)) {
          token = textResponse;
          console.log("Token extraído do texto:", token);
        }
      }
    } else {
      console.warn(`Falha na autenticação: ${authResponse.status}`);
      // Se falhar, usar token simulado para continuidade dos testes
      token = "mock-token-for-testing";
    }
    
    // Preparar parâmetros de busca
    const tripDuration = calculateTripDuration(params.departureDate, params.returnDate);
    const departureFormatted = new Date(params.departureDate).toISOString().split('T')[0];
    const returnFormatted = new Date(params.returnDate).toISOString().split('T')[0];
    
    // Acrescentar token aos headers para a busca
    const searchAuthHeaders = {
      ...headers,
      'Authorization': `Bearer ${token}`
    };
    
    // Endpoints e payloads para a busca de planos
    const endpoints = [
      '/plans/search',
      '/plans',
      '/offers/search',
      '/offers'
    ];
    
    const searchPayloads = [
      {
        origin: params.origin,
        destination: params.destination,
        departure_date: departureFormatted,
        return_date: returnFormatted,
        trip_duration: tripDuration,
        passengers: params.passengers.ages.map(age => ({ age }))
      },
      {
        origin: params.origin,
        destination: params.destination,
        departureDate: departureFormatted,
        returnDate: returnFormatted,
        tripDuration: tripDuration,
        travelers: params.passengers.ages
      }
    ];
    
    // Tentar cada combinação de endpoint e payload
    for (const endpoint of endpoints) {
      for (const payload of searchPayloads) {
        try {
          const searchUrl = getApiUrl(endpoint);
          console.log(`Tentando buscar em: ${searchUrl}`);
          console.log("Payload:", JSON.stringify(payload));
          
          const searchResponse = await fetch(searchUrl, {
            method: 'POST',
            headers: searchAuthHeaders,
            body: JSON.stringify(payload),
            mode: 'cors'
          });
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            console.log("Dados obtidos:", searchData);
            
            let plans = [];
            if (Array.isArray(searchData)) {
              plans = searchData;
            } else if (searchData.plans) {
              plans = searchData.plans;
            } else if (searchData.data) {
              plans = searchData.data;
            } else if (searchData.offers) {
              plans = searchData.offers;
            } else if (searchData.results) {
              plans = searchData.results;
            }
            
            if (plans && plans.length > 0) {
              console.log(`Encontrados ${plans.length} planos.`);
              return processPlans(plans);
            }
          } else {
            console.warn(`Falha na busca: ${searchResponse.status}`);
            if (searchResponse.status === 401 || searchResponse.status === 403) {
              console.log("Erro de autorização. Tentando com outro endpoint...");
              continue;
            }
            try {
              const errorText = await searchResponse.text();
              console.log("Detalhes do erro:", errorText);
            } catch (e) {
              console.log("Não foi possível obter detalhes do erro");
            }
          }
        } catch (searchError) {
          console.warn(`Erro na requisição para ${endpoint}:`, searchError);
        }
      }
    }
    
    // Última tentativa: acesso direto sem payload
    try {
      const plansUrl = getApiUrl('/plans');
      console.log(`Tentando acessar planos diretamente em: ${plansUrl}`);
      
      const plansResponse = await fetch(plansUrl, {
        method: 'GET',
        headers: searchAuthHeaders,
        mode: 'cors'
      });
      
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        console.log("Planos obtidos diretamente:", plansData);
        
        let plans = [];
        if (Array.isArray(plansData)) {
          plans = plansData;
        } else if (plansData.plans) {
          plans = plansData.plans;
        } else if (plansData.data) {
          plans = plansData.data;
        }
        
        if (plans && plans.length > 0) {
          return processPlans(plans);
        }
      }
    } catch (plansError) {
      console.warn("Erro ao acessar planos diretamente:", plansError);
    }
    
    console.warn("Todas as tentativas de conexão falharam. Usando dados mockados.");
    
    if (apiConfig.useProxy) {
      toast.error("Não foi possível conectar à API da Universal Assistance mesmo usando proxy. Verifique se o proxy está funcionando e tente outro serviço de proxy.", {
        duration: 8000
      });
    } else {
      toast.error("Não foi possível conectar à API da Universal Assistance. Tente ativar a opção de proxy CORS nas configurações da API.", {
        duration: 8000
      });
    }
    
    return generateMockOffers(5);
  } catch (error) {
    console.error("Erro ao buscar dados da Universal Assistance:", error);
    toast.error("Erro ao conectar com a API da Universal Assistance. Tentando novamente com outro método...");
    
    // Teste simples de conectividade
    try {
      const testUrl = "https://jsonplaceholder.typicode.com/todos/1";
      const testResponse = await fetch(testUrl);
      console.log("Teste de conectividade:", testResponse.ok ? "Sucesso" : "Falha");
      
      if (testResponse.ok) {
        toast.info("Conexão com internet confirmada. O problema pode ser específico da API da Universal Assistance ou relacionado a CORS.");
      } else {
        toast.error("Não foi possível estabelecer conexão com a internet.");
      }
    } catch (testError) {
      console.error("Erro no teste de conectividade:", testError);
      toast.error("Problema de conectividade detectado. Verifique sua conexão de internet.");
    }
    
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
    recommended: index === 0,
  }));
};

// Helper function to extract coverage values
const extractCoverage = (plan: any, type: string, defaultValue: number): number => {
  if (plan.coverages?.[type]) return plan.coverages[type];
  if (plan[`${type}_coverage`]) return plan[`${type}_coverage`];
  if (plan.coverage?.[type]) return plan.coverage[type];
  
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
  if (Array.isArray(plan.benefits) && typeof plan.benefits[0] === 'string') {
    return plan.benefits;
  }
  
  if (Array.isArray(plan.benefits) && typeof plan.benefits[0] === 'object') {
    return plan.benefits.map((b: any) => b.name || b.title || b.description || "Benefício");
  }
  
  if (Array.isArray(plan.features)) {
    return plan.features.map((f: any) => {
      if (typeof f === 'string') return f;
      return f.name || f.title || f.description || "Recurso";
    });
  }
  
  return ["COVID-19", "Telemedicina", "Traslado médico"];
};

// Função para gerar ofertas mockadas
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
    const price = Math.floor(Math.random() * 300) + 100;
    const medicalCoverage = Math.floor(Math.random() * 80000) + 20000;
    
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
      recommended: i === 0,
    });
  }
  
  console.log("Gerando ofertas mockadas:", mockOffers);
  
  return mockOffers;
};
