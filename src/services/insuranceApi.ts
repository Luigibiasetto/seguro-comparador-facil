import { toast } from "sonner";

// Tipos para as APIs
export interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
}

export interface InsuranceOffer {
  id: string;
  providerId: string;
  name: string;
  price: number;
  coverage: {
    medical: number;
    baggage: number;
    cancellation: number;
    delay: number;
    other?: Record<string, number>;
  };
  benefits: string[];
  rating: number;
  recommended: boolean;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: {
    count: number;
    ages: number[];
  };
  phone?: string;
}

// Configurações da API
interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  useMock: boolean;
  provider?: string; // Qual provedor específico usar (ex: "universal-assist")
  providerSettings?: {
    clientId?: string;
    clientSecret?: string;
    username?: string;
    password?: string;
    apiCode?: string;
    endpoint?: string;
  };
}

let apiConfig: ApiConfig = {
  baseUrl: "",
  apiKey: "",
  useMock: true, // Por padrão, usa dados simulados
  provider: "",
  providerSettings: {}
};

// Função para configurar a API
export const configureInsuranceAPI = (config: Partial<ApiConfig>) => {
  apiConfig = { ...apiConfig, ...config };
  console.log("API configurada:", apiConfig);
  return apiConfig;
};

// Lista de provedores simulados (será substituída pela API real)
const mockProviders: InsuranceProvider[] = [
  { id: "assist-card", name: "Assist Card", logo: "/placeholder.svg" },
  { id: "coris", name: "Coris Seguros", logo: "/placeholder.svg" },
  { id: "gc-assist", name: "GC Assist", logo: "/placeholder.svg" },
  { id: "intermac", name: "Intermac", logo: "/placeholder.svg" },
  { id: "universal-assist", name: "Universal Assist", logo: "/placeholder.svg" },
];

// Função para gerar ofertas simuladas (será substituída pela API real)
const generateMockOffers = (params: SearchParams): InsuranceOffer[] => {
  const { destination, passengers } = params;
  const tripDuration = calculateTripDuration(params.departureDate, params.returnDate);
  
  // Preço base por dia por pessoa
  const basePricePerDay = destination === "US" || destination === "CA" ? 12 : 
                          (["GB", "FR", "DE", "IT", "ES"].includes(destination) ? 10 : 8);
  
  return mockProviders.flatMap(provider => {
    // Cada provedor terá algumas ofertas
    const offerCount = Math.floor(Math.random() * 3) + 1;
    
    return Array.from({ length: offerCount }, (_, index) => {
      // Calcular multiplicador baseado na pessoa
      const priceModifier = 1 + (index * 0.5);
      
      // Calcular o preço total para todos os passageiros
      const totalPrice = passengers.ages.reduce((sum, age) => {
        const ageMultiplier = age < 18 ? 0.7 : (age > 65 ? 1.5 : 1);
        return sum + (basePricePerDay * tripDuration * priceModifier * ageMultiplier);
      }, 0);
      
      // Gerar uma oferta
      return {
        id: `${provider.id}-${index}`,
        providerId: provider.id,
        name: ["Básico", "Padrão", "Premium"][index] || "Personalizado",
        price: Math.round(totalPrice * 100) / 100,
        coverage: {
          medical: [30000, 60000, 100000][index] || 30000,
          baggage: [1000, 1500, 2000][index] || 1000,
          cancellation: [500, 1000, 2000][index] || 500,
          delay: [100, 200, 300][index] || 100,
        },
        benefits: [
          "Atendimento 24h em português",
          "Cobertura COVID-19",
          "Telemedicina",
          "Reembolso rápido",
          "Seguro de bagagem",
          "Esportes amadores"
        ].slice(0, 3 + index),
        rating: 3 + (Math.random() * 2),
        recommended: index === 1, // O plano padrão é o recomendado
      };
    });
  });
};

// Calcular a duração da viagem em dias
const calculateTripDuration = (departureDate: string, returnDate: string): number => {
  const start = new Date(departureDate);
  const end = new Date(returnDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Integração específica com a API da Universal Assistance
const fetchUniversalAssistanceOffers = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    console.log("Iniciando busca de dados da Universal Assistance");
    console.log("Configuração da API:", apiConfig);
    
    if (!apiConfig.providerSettings?.username || !apiConfig.providerSettings?.password || !apiConfig.providerSettings?.apiCode) {
      throw new Error("Credenciais da Universal Assistance não configuradas corretamente");
    }

    // Primeiro autenticar para obter o token
    console.log("Tentando autenticação com a Universal Assistance...");
    const authResponse = await fetch(`${apiConfig.baseUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Code': apiConfig.providerSettings.apiCode
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

    // Calcular a duração da viagem em dias
    const tripDuration = calculateTripDuration(params.departureDate, params.returnDate);

    // Formatar datas no padrão aceito pela API (YYYY-MM-DD)
    const departureFormatted = new Date(params.departureDate).toISOString().split('T')[0];
    const returnFormatted = new Date(params.returnDate).toISOString().split('T')[0];

    // Mapear países para os códigos aceitos pela Universal Assistance
    const destinationCode = mapCountryCodeForUniversalAssistance(params.destination);
    const originCode = mapCountryCodeForUniversalAssistance(params.origin);

    console.log("Parâmetros formatados:", {
      origin: originCode,
      destination: destinationCode,
      departure: departureFormatted,
      return: returnFormatted,
      duration: tripDuration,
      passengers: params.passengers.ages
    });

    // Preparar os dados para a busca de seguros
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

    // Fazer a requisição para buscar planos
    const response = await fetch(`${apiConfig.baseUrl}/plans/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-API-Code': apiConfig.providerSettings.apiCode
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

    // Verificar se a resposta contém planos
    if (!data.plans || !Array.isArray(data.plans) || data.plans.length === 0) {
      console.warn("Nenhum plano retornado na resposta");
      return [];
    }

    // Mapear a resposta da Universal Assistance para o formato interno
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
    // Retornando array vazio em caso de erro para evitar quebra da aplicação
    return [];
  }
};

// Função para mapear códigos de país para o formato da Universal Assistance
const mapCountryCodeForUniversalAssistance = (countryCode: string): string => {
  // Verificar se é um código de país válido
  if (!countryCode || countryCode.toLowerCase() === 'brasil') {
    return 'BR';
  }
  
  // Converter códigos comuns
  const mappings: Record<string, string> = {
    "US": "USA",
    "GB": "GBR",
    "FR": "FRA",
    "DE": "DEU",
    "IT": "ITA",
    "ES": "ESP",
    "PT": "PRT",
    "AR": "ARG",
    "CL": "CHL",
    "UY": "URY",
    "PY": "PRY",
    "BR": "BRA",
    "CO": "COL",
    "MX": "MEX",
    "PE": "PER",
    "EC": "ECU",
    "BO": "BOL",
    "VE": "VEN",
    // Adicione mais mapeamentos conforme necessário
  };
  
  return mappings[countryCode] || countryCode;
};

// Integração com a API real da seguradora
const fetchRealInsurances = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    // Se estiver configurado especificamente para Universal Assistance
    if (apiConfig.provider === "universal-assist") {
      return await fetchUniversalAssistanceOffers(params);
    }
    
    // Implementação genérica para outras APIs
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Adiciona chave de API se fornecida
    if (apiConfig.apiKey) {
      headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
    }
    
    // Preparar os dados para a API da seguradora
    const requestData = {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      passengers: params.passengers,
      phone: params.phone || ""
    };
    
    // Fazer a solicitação à API
    const response = await fetch(`${apiConfig.baseUrl}/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Mapear a resposta da API para o formato interno
    // Nota: Ajuste este mapeamento conforme a estrutura real da API
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

// Função para buscar provedores reais
const fetchRealProviders = async (): Promise<InsuranceProvider[]> => {
  try {
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
    
    // Mapear a resposta da API para o formato interno
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

// Função que será chamada por componentes React - decide entre mock ou API real
export const searchInsurances = async (params: SearchParams): Promise<InsuranceOffer[]> => {
  try {
    console.log("Iniciando busca de seguros com parâmetros:", params);
    console.log("Configuração atual da API:", apiConfig);
    
    // Usando API real ou dados simulados
    if (!apiConfig.useMock && (apiConfig.baseUrl || apiConfig.provider)) {
      console.log("Usando API real para busca de seguros");
      const offers = await fetchRealInsurances(params);
      console.log(`${offers.length} ofertas encontradas`);
      return offers;
    } else {
      console.log("Usando dados simulados para busca de seguros");
      // Simular tempo de resposta da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar ofertas simuladas
      const offers = generateMockOffers(params);
      
      // Ordenar por preço (padrão)
      return offers.sort((a, b) => a.price - b.price);
    }
  } catch (error) {
    console.error("Erro ao buscar seguros:", error);
    toast.error("Erro ao buscar seguros. Por favor, tente novamente.");
    return [];
  }
};

// Função para obter os provedores (API real ou mock)
export const getInsuranceProviders = async (): Promise<InsuranceProvider[]> => {
  try {
    if (!apiConfig.useMock && apiConfig.baseUrl) {
      return await fetchRealProviders();
    } else {
      // Simular tempo de resposta da API
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockProviders;
    }
  } catch (error) {
    console.error("Erro ao obter provedores:", error);
    toast.error("Erro ao carregar as seguradoras. Por favor, tente novamente.");
    return mockProviders;
  }
};

// Função para preparar os parâmetros da URL para a busca
export const parseSearchParams = (searchParams: URLSearchParams): SearchParams => {
  const origin = searchParams.get("origin") || "brasil";
  const destination = searchParams.get("destination") || "";
  const departureDate = searchParams.get("departureDate") || new Date().toISOString();
  const returnDate = searchParams.get("returnDate") || new Date().toISOString();
  const passengersStr = searchParams.get("passengers") || '{"count":1,"ages":[30]}';
  const phone = searchParams.get("phone") || undefined;
  
  let passengers;
  try {
    passengers = JSON.parse(passengersStr);
  } catch (e) {
    passengers = { count: 1, ages: [30] };
  }
  
  return {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    phone
  };
};
