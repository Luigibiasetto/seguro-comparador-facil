import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Configuração de headers CORS para permitir acesso da aplicação
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Credenciais da Universal Assistance
const username = Deno.env.get("UNIVERSAL_ASSIST_USERNAME") || "raphaelbellei";
const password = Deno.env.get("UNIVERSAL_ASSIST_PASSWORD") || "Anthony25";
const apiBaseUrl = "https://api-br.universal-assistance.com/v1";

// Função para lidar com requisições CORS preflight
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  return null;
}

// Função para autenticar na API e obter um token
async function authenticate() {
  console.log("Iniciando autenticação com a Universal Assistance");
  console.log(`Usando credenciais: usuário=${username}, API Base=${apiBaseUrl}`);
  
  const basicAuth = btoa(`${username}:${password}`);
  
  // Define endpoints mais específicos com base na documentação
  const authEndpoints = [
    '/auth/token',
    '/auth',
    '/token',
    '/login',
    '/oauth/token',
    '/api/auth',
    '/api/login',
    '/api/v1/auth',
    '/v1/auth'
  ];
  
  let token = null;
  let authError = null;
  let lastResponseDetails = null;
  
  // Tentar diversos endpoints de autenticação
  for (const endpoint of authEndpoints) {
    try {
      const fullEndpointUrl = `${apiBaseUrl}${endpoint}`;
      console.log(`Tentando autenticação em: ${fullEndpointUrl}`);
      
      // Primeiro, verificar se o endpoint existe
      try {
        const checkResponse = await fetch(fullEndpointUrl, {
          method: 'HEAD',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        console.log(`Verificação do endpoint ${endpoint}: Status ${checkResponse.status}`);
      } catch (checkError) {
        console.log(`Erro ao verificar endpoint ${endpoint}:`, checkError);
      }
      
      // Tentar diferentes métodos de autenticação
      // 1. Basic Auth
      const authResponse = await fetch(fullEndpointUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      console.log(`Status da resposta para ${endpoint}: ${authResponse.status}`);
      
      // Armazenar detalhes da última resposta
      try {
        const responseBody = await authResponse.text();
        console.log(`Corpo da resposta (${endpoint}): ${responseBody.substring(0, 200)}${responseBody.length > 200 ? '...' : ''}`);
        lastResponseDetails = {
          endpoint,
          status: authResponse.status,
          body: responseBody
        };
      } catch (bodyError) {
        console.log(`Erro ao ler corpo da resposta de ${endpoint}:`, bodyError);
        lastResponseDetails = {
          endpoint,
          status: authResponse.status,
          error: "Erro ao ler corpo"
        };
      }
      
      if (authResponse.ok) {
        try {
          // Tentar novamente como JSON
          const responseData = await fetch(fullEndpointUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(r => r.json());
          
          console.log("Dados de autenticação recebidos:", JSON.stringify(responseData).substring(0, 200));
          
          // Extrair token de diferentes formatos de resposta
          token = responseData.token || 
                 responseData.access_token || 
                 responseData.accessToken || 
                 (responseData.data && responseData.data.token);
                 
          if (token) {
            console.log("Token obtido com sucesso");
            return { success: true, token };
          }
        } catch (jsonError) {
          console.log("Erro ao processar JSON da resposta:", jsonError);
          
          // Tentar extrair token do texto da resposta
          const textResponse = await authResponse.text();
          if (textResponse && /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(textResponse)) {
            token = textResponse;
            console.log("Token extraído do texto da resposta");
            return { success: true, token };
          }
        }
      } else {
        console.log(`Autenticação falhou para ${endpoint}. Status: ${authResponse.status}`);
      }
      
      // 2. Tentar com JSON no body
      try {
        const jsonAuthResponse = await fetch(fullEndpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password
          }),
        });
        
        console.log(`Status da resposta JSON para ${endpoint}: ${jsonAuthResponse.status}`);
        
        if (jsonAuthResponse.ok) {
          try {
            const jsonResponseData = await jsonAuthResponse.json();
            console.log("Dados de autenticação JSON recebidos:", JSON.stringify(jsonResponseData).substring(0, 200));
            
            token = jsonResponseData.token || 
                   jsonResponseData.access_token || 
                   jsonResponseData.accessToken || 
                   (jsonResponseData.data && jsonResponseData.data.token);
                   
            if (token) {
              console.log("Token obtido com sucesso via JSON auth");
              return { success: true, token };
            }
          } catch (jsonDataError) {
            console.log("Erro ao processar resposta JSON:", jsonDataError);
          }
        }
      } catch (jsonAuthError) {
        console.log(`Erro ao tentar autenticação JSON em ${endpoint}:`, jsonAuthError);
      }
      
    } catch (error) {
      console.log(`Erro ao tentar autenticação em ${endpoint}:`, error);
      authError = error;
    }
  }
  
  return { 
    success: false, 
    error: authError ? authError.message : "Não foi possível autenticar com nenhum dos endpoints",
    lastResponseDetails
  };
}

// Função para buscar planos de seguro
async function fetchPlans(token: string, searchParams: any) {
  console.log("Buscando planos com os parâmetros:", searchParams);
  
  const searchAuthHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Formatação das datas
  const departureFormatted = new Date(searchParams.departureDate).toISOString().split('T')[0];
  const returnFormatted = new Date(searchParams.returnDate).toISOString().split('T')[0];
  
  // Calcular duração da viagem
  const departureDate = new Date(searchParams.departureDate);
  const returnDate = new Date(searchParams.returnDate);
  const tripDuration = Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Preparar os payloads para diferentes formatos possíveis da API
  const payloads = [
    {
      origin: searchParams.origin,
      destination: searchParams.destination,
      departure_date: departureFormatted,
      return_date: returnFormatted,
      trip_duration: tripDuration,
      passengers: searchParams.passengers.ages.map((age: number) => ({ age }))
    },
    {
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: departureFormatted,
      returnDate: returnFormatted,
      tripDuration: tripDuration,
      travelers: searchParams.passengers.ages
    }
  ];
  
  // Endpoints para tentar buscar planos
  const endpoints = [
    '/plans/search',
    '/plans',
    '/offers/search',
    '/offers'
  ];
  
  // Tentar cada combinação de endpoint e payload
  for (const endpoint of endpoints) {
    for (const payload of payloads) {
      try {
        console.log(`Tentando buscar em: ${apiBaseUrl}${endpoint}`);
        console.log("Payload:", JSON.stringify(payload));
        
        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
          method: 'POST',
          headers: searchAuthHeaders,
          body: JSON.stringify(payload),
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Resposta recebida de ${endpoint}`);
          
          let plans = [];
          if (Array.isArray(data)) {
            plans = data;
          } else if (data.plans) {
            plans = data.plans;
          } else if (data.data) {
            plans = data.data;
          } else if (data.offers) {
            plans = data.offers;
          } else if (data.results) {
            plans = data.results;
          }
          
          if (plans && plans.length > 0) {
            console.log(`Encontrados ${plans.length} planos`);
            return { success: true, plans: processPlans(plans) };
          }
        } else {
          console.log(`Falha na busca: ${response.status}`);
          try {
            const errorText = await response.text();
            console.log("Detalhes do erro:", errorText);
          } catch (e) {
            console.log("Não foi possível obter detalhes do erro");
          }
        }
      } catch (error) {
        console.log(`Erro ao buscar planos em ${endpoint}:`, error);
      }
    }
  }
  
  // Última tentativa: acesso direto sem payload
  try {
    console.log("Tentando acesso direto aos planos");
    const plansResponse = await fetch(`${apiBaseUrl}/plans`, {
      method: 'GET',
      headers: searchAuthHeaders,
    });
    
    if (plansResponse.ok) {
      const plansData = await plansResponse.json();
      console.log("Planos obtidos diretamente");
      
      let plans = [];
      if (Array.isArray(plansData)) {
        plans = plansData;
      } else if (plansData.plans) {
        plans = plansData.plans;
      } else if (plansData.data) {
        plans = plansData.data;
      }
      
      if (plans && plans.length > 0) {
        console.log(`Encontrados ${plans.length} planos diretamente`);
        return { success: true, plans: processPlans(plans) };
      }
    }
  } catch (error) {
    console.log("Erro ao acessar planos diretamente:", error);
  }
  
  return { 
    success: false, 
    error: "Não foi possível encontrar planos com os parâmetros fornecidos" 
  };
}

// Função para processar os planos retornados pela API
function processPlans(plans: any[]) {
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
}

// Função auxiliar para extrair valores de cobertura
function extractCoverage(plan: any, type: string, defaultValue: number): number {
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
}

// Função auxiliar para extrair benefícios
function extractBenefits(plan: any): string[] {
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
}

// Função para gerar ofertas mockadas caso ocorra falha
function generateMockOffers(count: number) {
  const mockOffers = [];
  
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
}

// Função para testar conectividade da API
async function testApiConnectivity() {
  console.log("Iniciando teste de conectividade da API Universal Assistance");
  
  // Tentar acessar a raiz da API para verificar se está online
  try {
    console.log(`Verificando conexão básica para: ${apiBaseUrl}`);
    const rootResponse = await fetch(apiBaseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Resposta da API raiz: Status ${rootResponse.status}`);
    
    let responseText = "";
    try {
      responseText = await rootResponse.text();
      console.log(`Corpo da resposta: ${responseText.substring(0, 200)}`);
    } catch (textError) {
      console.log("Erro ao ler corpo da resposta:", textError);
    }
    
    // Verificar se conseguimos conectar
    const isConnected = rootResponse.status !== 0;
    
    if (isConnected) {
      console.log("Conexão básica com a API estabelecida");
      
      // Verificar documentação da API se disponível
      try {
        const docsEndpoints = ['/docs', '/swagger', '/api-docs', '/openapi.json'];
        for (const docEndpoint of docsEndpoints) {
          try {
            const docResponse = await fetch(`${apiBaseUrl}${docEndpoint}`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            });
            
            if (docResponse.ok) {
              console.log(`Documentação da API encontrada em: ${docEndpoint}`);
              break;
            }
          } catch (docError) {
            console.log(`Erro ao verificar documentação em ${docEndpoint}:`, docError);
          }
        }
      } catch (docsError) {
        console.log("Erro ao verificar documentação da API:", docsError);
      }
      
      // Tentar autenticação
      const authResult = await authenticate();
      
      if (authResult.success) {
        return {
          success: true,
          message: "Conectado com sucesso à API",
          authStatus: "Autenticado com sucesso"
        };
      } else {
        return {
          success: false,
          message: "Conectado à API, mas falha na autenticação",
          authError: authResult.error,
          authDetails: authResult.lastResponseDetails
        };
      }
    } else {
      console.log("Falha na conexão básica com a API");
      return {
        success: false,
        message: "Não foi possível conectar à API",
        details: "Falha na conexão básica"
      };
    }
  } catch (error) {
    console.error("Erro durante teste de conectividade:", error);
    return {
      success: false,
      message: "Erro ao testar conectividade",
      error: error instanceof Error ? error.message : "Erro desconhecido"
    };
  }
}

// Função principal para processar as requisições
serve(async (req) => {
  // Lidar com requisições CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Extrair o caminho da requisição
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    if (path === 'search') {
      // Se o método for POST, processar a busca
      if (req.method === 'POST') {
        try {
          const requestData = await req.json();
          console.log("Dados recebidos para busca:", requestData);
          
          // Autenticar na API
          const authResult = await authenticate();
          
          if (!authResult.success) {
            console.log("Falha na autenticação:", authResult.error);
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: "Erro de autenticação", 
                details: authResult.error,
                mockData: generateMockOffers(5) 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          }
          
          // Buscar planos com o token obtido
          const plansResult = await fetchPlans(authResult.token, requestData);
          
          if (plansResult.success) {
            return new Response(
              JSON.stringify({ success: true, offers: plansResult.plans }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          } else {
            console.log("Falha ao buscar planos:", plansResult.error);
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: "Erro ao buscar planos", 
                details: plansResult.error,
                mockData: generateMockOffers(5) 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          }
        } catch (error) {
          console.error("Erro ao processar solicitação de busca:", error);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Erro interno", 
              details: error instanceof Error ? error.message : "Erro desconhecido",
              mockData: generateMockOffers(5) 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: 500 
            }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ success: false, error: "Método não suportado. Use POST." }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 405 
          }
        );
      }
    } else if (path === 'test') {
      // Endpoint para testar a conexão com a API
      console.log("Testando conexão com a API");
      
      try {
        // Primeiro teste de conectividade básica
        const connectivityTest = await testApiConnectivity();
        
        if (connectivityTest.success) {
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Conexão bem sucedida",
              details: connectivityTest.authStatus || "API acessível"
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: 200 
            }
          );
        } else {
          console.log("Falha no teste de conectividade:", connectivityTest);
          
          // Tentar autenticação como último recurso
          const authResult = await authenticate();
          
          return new Response(
            JSON.stringify({ 
              success: authResult.success, 
              message: authResult.success ? "Conexão bem sucedida" : "Falha na conexão",
              details: authResult.success ? "Token obtido com sucesso" : authResult.error,
              connectivityResult: connectivityTest,
              lastResponseDetails: authResult.lastResponseDetails
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: 200 
            }
          );
        }
      } catch (error) {
        console.error("Erro ao testar conexão:", error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Erro ao testar conexão", 
            details: error instanceof Error ? error.message : "Erro desconhecido" 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          }
        );
      }
    } else {
      // Se o caminho não for reconhecido
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Endpoint não encontrado",
          availableEndpoints: ['/search', '/test']
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 404 
        }
      );
    }
  } catch (error) {
    console.error("Erro geral na função:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Erro interno do servidor", 
        details: error instanceof Error ? error.message : "Erro desconhecido" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
