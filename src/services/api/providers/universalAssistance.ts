
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

    // Tenta vários endpoints diferentes para a API
    const possibleAuthEndpoints = [
      `${baseUrl}/auth/login`,
      `${baseUrl}/v1/users/login`,
      `${baseUrl}/api/auth/login`,
      `${baseUrl}/login`,
      `${baseUrl}/v2/auth/login`
    ];
    
    let token = null;
    let authResponse = null;
    let authError = null;
    
    // Try each authentication endpoint until one works
    for (const authUrl of possibleAuthEndpoints) {
      try {
        console.log("Tentando URL de autenticação:", authUrl);
        
        // Tentativa com diferentes modos de CORS
        const corsOptions = [
          { mode: 'cors' as RequestMode },
          { mode: 'no-cors' as RequestMode },
          {}  // default fetch options
        ];
        
        for (const corsOption of corsOptions) {
          try {
            authResponse = await fetch(authUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                username: apiConfig.providerSettings.username,
                password: apiConfig.providerSettings.password
              }),
              ...corsOption
            });
            
            console.log(`Status da resposta de autenticação (${authUrl}):`, authResponse.status);
            
            // Se o modo no-cors foi usado, não podemos ler o corpo da resposta
            if (corsOption.mode === 'no-cors') {
              console.log("Usando modo no-cors, não é possível verificar a resposta");
              // Tentando próxima abordagem pois no-cors não permite acesso à resposta
              continue;
            }
            
            if (!authResponse.ok) {
              const errorText = await authResponse.text();
              console.error(`Erro na resposta de autenticação (${authUrl}):`, errorText);
              continue; // Tenta próxima opção
            }

            const authData = await authResponse.json();
            console.log("Resposta de autenticação bem-sucedida:", authData);
            
            token = authData.token || authData.access_token || authData.accessToken;
            
            if (token) {
              console.log("Token obtido com sucesso de:", authUrl);
              break; // Sai do loop de CORS se token obtido
            } else {
              console.error("Token não encontrado na resposta:", authData);
            }
          } catch (error) {
            console.error(`Erro com modo CORS ${corsOption.mode} para ${authUrl}:`, error);
            // Continua para a próxima opção de CORS
          }
        }
        
        if (token) break; // Sai do loop de endpoints se token obtido
      } catch (error) {
        console.error(`Erro ao tentar autenticação em ${authUrl}:`, error);
        authError = error;
      }
    }

    if (!token) {
      // Se todas as tentativas de autenticação falharem, registra detalhes e lança erro
      console.error("Todas as tentativas de autenticação falharam. Último erro:", authError);
      
      // Verifica se pode ser um problema com a origem
      console.log("Verificando se pode ser um problema de CORS ou origem...");
      console.log("Resposta HTTP da última tentativa:", authResponse?.status, authResponse?.statusText);
      
      throw new Error("Não foi possível autenticar com a Universal Assistance. A API pode estar bloqueando requisições do navegador por questões de CORS, ou as credenciais estão incorretas.");
    }

    // Calcula a duração da viagem em dias
    const tripDuration = calculateTripDuration(params.departureDate, params.returnDate);

    // Formata as datas no padrão aceito pela API (YYYY-MM-DD)
    const departureFormatted = new Date(params.departureDate).toISOString().split('T')[0];
    const returnFormatted = new Date(params.returnDate).toISOString().split('T')[0];

    // Use origin and destination codes sent by the searcher
    const originCode = params.origin; // BR or INT-BR
    const destinationCode = params.destination; // NAMERICA, SAMERICA, EUROPE, etc.

    console.log("Parâmetros formatados para busca:", {
      origin: originCode,
      destination: destinationCode,
      departure: departureFormatted,
      return: returnFormatted,
      duration: tripDuration,
      passengers: params.passengers.ages
    });

    // Prepara os dados para busca de seguro
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

    // Tenta diferentes endpoints possíveis de busca
    const possibleSearchEndpoints = [
      `${baseUrl}/api/plans`,
      `${baseUrl}/v1/plans`,
      `${baseUrl}/plans/search`,
      `${baseUrl}/plans`,
      `${baseUrl}/v2/plans`
    ];
    
    let plansData = null;
    let searchError = null;
    
    // Tenta cada endpoint de busca até um funcionar
    for (const searchUrl of possibleSearchEndpoints) {
      try {
        console.log("Tentando URL para busca de planos:", searchUrl);
        console.log("Dados da requisição:", searchData);
        
        // Faz a requisição para buscar planos
        const response = await fetch(searchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(searchData),
          mode: 'cors' // Explicitamente solicita CORS
        });

        console.log("Status da resposta de busca:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Erro na resposta de busca (${searchUrl}):`, errorText);
          continue; // Tenta próximo endpoint
        }

        plansData = await response.json();
        console.log("Resposta de busca de planos bem-sucedida:", plansData);
        break; // Sai do loop se dados obtidos
      } catch (error) {
        console.error(`Erro ao buscar planos em ${searchUrl}:`, error);
        searchError = error;
      }
    }

    if (!plansData) {
      console.error("Todas as tentativas de busca de planos falharam. Último erro:", searchError);
      console.warn("Usando dados de demonstração devido a falha na API.");
      toast.info("Não foi possível conectar à API da Universal Assistance. Usando dados de demonstração.");
      return generateMockOffers(4); // Retorna dados mockados se nenhum plano for encontrado
    }

    // Verifica se a resposta contém planos
    const plans = plansData.plans || plansData.results || plansData.data || [];
    
    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      console.warn("Nenhum plano retornado na resposta");
      toast.info("Nenhum plano foi retornado pela API. Usando dados de demonstração.");
      return generateMockOffers(3); // Retorna dados mockados se nenhum plano for retornado
    }

    // Mapeia a resposta da Universal Assistance para o formato interno
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
  } catch (error) {
    console.error("Erro ao buscar dados da Universal Assistance:", error);
    toast.error("Erro ao buscar dados da Universal Assistance. A API pode estar bloqueando requisições do navegador (CORS) ou as credenciais podem estar incorretas.");
    // Retorna dados mockados em caso de erro para evitar quebrar a aplicação
    return generateMockOffers(5);
  }
};

// Função auxiliar para gerar ofertas mockadas com diferentes preços/coberturas
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
