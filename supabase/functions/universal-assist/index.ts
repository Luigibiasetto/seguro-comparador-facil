import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Configuração de headers CORS para permitir acesso da aplicação
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

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

// Função para extrair coberturas
function extractCoverage(product: any, type: string, defaultValue: number): number {
  // Tentar extrair cobertura dos diferentes formatos possíveis de resposta
  if (product.coberturas) {
    const cobertura = Array.isArray(product.coberturas)
      ? product.coberturas.find((c: any) => 
          c.tipo?.toLowerCase() === type || 
          c.nome?.toLowerCase().includes(type))
      : product.coberturas[type];
      
    if (cobertura) {
      return parseFloat(cobertura.valor || cobertura.valorCoberto || "0") || defaultValue;
    }
  }
  
  // Verificar estruturas alternativas
  if (product[`cobertura${type.charAt(0).toUpperCase() + type.slice(1)}`]) {
    return parseFloat(product[`cobertura${type.charAt(0).toUpperCase() + type.slice(1)}`]) || defaultValue;
  }
  
  return defaultValue;
}

// Função para extrair benefícios
function extractBenefits(product: any): string[] {
  if (product.beneficios && Array.isArray(product.beneficios)) {
    return product.beneficios.map((b: any) => {
      if (typeof b === 'string') return b;
      return b.nome || b.descricao || "Benefício";
    });
  }
  
  if (product.caracteristicas && Array.isArray(product.caracteristicas)) {
    return product.caracteristicas.map((c: any) => {
      if (typeof c === 'string') return c;
      return c.nome || c.descricao || "Característica";
    });
  }
  
  return ["COVID-19", "Telemedicina", "Assistência 24h", "Traslado médico"];
}

// Função para processar planos
function processPlans(products: any[]): any[] {
  return products.map((product: any, index: number) => ({
    id: product.id || product.codigo || `universal-${Math.random().toString(36).substring(2, 9)}`,
    providerId: "universal-assist",
    name: product.nome || product.descricao || `Plano Universal ${index + 1}`,
    price: parseFloat(product.preco || product.valorBruto || "0") || Math.floor(Math.random() * 300) + 100,
    coverage: {
      medical: extractCoverage(product, 'medical', 40000),
      baggage: extractCoverage(product, 'baggage', 1000),
      cancellation: extractCoverage(product, 'cancellation', 2000),
      delay: extractCoverage(product, 'delay', 200),
    },
    benefits: extractBenefits(product),
    rating: 4.5 + (Math.random() * 0.5),
    recommended: index === 0,
  }));
}

// Função para gerar ofertas mockadas
function generateMockOffers(count: number): any[] {
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
  
  return mockOffers;
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
    
    // Função para fazer requisição à API da Universal Assistance
    async function makeUniversalRequest(endpoint: string, method: string, body?: any, credentials?: any) {
      try {
        // Se credenciais não foram fornecidas no body, tentamos extrair da requisição
        if (!credentials && body?.credentials) {
          credentials = body.credentials;
        }
        
        // Verificar se temos credenciais
        if (!credentials || !credentials.login || !credentials.senha) {
          return {
            success: false,
            error: "Credenciais não fornecidas"
          };
        }
        
        // URL da API
        const apiBaseUrl = "https://api-br.universal-assistance.com/v1";
        
        // Headers com credenciais conforme documentação
        const apiHeaders = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Login': credentials.login,
          'Senha': credentials.senha
        };
        
        console.log(`Fazendo requisição ${method} para ${apiBaseUrl}${endpoint}`);
        console.log("Headers:", JSON.stringify(apiHeaders, null, 2));
        
        // Montar opções da requisição
        const options: RequestInit = {
          method,
          headers: apiHeaders,
        };
        
        // Adicionar body se for POST ou PUT
        if ((method === 'POST' || method === 'PUT') && body) {
          const requestBody = method === 'POST' ? body.payload || body : body;
          options.body = JSON.stringify(requestBody);
          console.log("Request body:", JSON.stringify(requestBody, null, 2));
        }
        
        // Fazer a requisição
        const apiResponse = await fetch(`${apiBaseUrl}${endpoint}`, options);
        
        if (!apiResponse.ok) {
          console.log(`Erro na API: ${apiResponse.status}`);
          let errorText = "";
          try {
            errorText = await apiResponse.text();
          } catch (e) {
            errorText = "Não foi possível obter detalhes do erro";
          }
          console.log("Detalhes do erro:", errorText);
          
          return {
            success: false,
            error: `Erro na API: ${apiResponse.status}`,
            details: errorText
          };
        }
        
        // Processar a resposta
        let apiData;
        try {
          apiData = await apiResponse.json();
          console.log("API Response:", JSON.stringify(apiData, null, 2));
        } catch (e) {
          // Se não for JSON, tentar obter como texto
          const text = await apiResponse.text();
          return {
            success: true,
            data: text
          };
        }
        
        return {
          success: true,
          data: apiData
        };
      } catch (error) {
        console.error(`Erro ao processar requisição ${endpoint}:`, error);
        return {
          success: false,
          error: "Erro interno",
          details: error instanceof Error ? error.message : "Erro desconhecido"
        };
      }
    }
    
    // Tratar diferentes endpoints
    if (path === 'cotacao') {
      if (req.method === 'POST') {
        try {
          const requestData = await req.json();
          console.log("Dados recebidos para cotação:", requestData);
          
          const apiResult = await makeUniversalRequest('/Cotacao', 'POST', requestData);
          
          if (!apiResult.success) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: apiResult.error,
                details: apiResult.details,
                mockData: generateMockOffers(5) 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          }
          
          // Se a requisição foi bem-sucedida, processar os dados
          const apiData = apiResult.data;
          
          // Extrair os produtos/planos
          let products = [];
          if (apiData.produtos) {
            products = apiData.produtos;
          } else if (apiData.planos) {
            products = apiData.planos;
          } else if (Array.isArray(apiData)) {
            products = apiData;
          }
          
          // Log detalhado dos produtos e seus valores
          console.log("Produtos encontrados:", products.length);
          products.forEach((product, index) => {
            console.log(`Produto ${index + 1}:`, {
              id: product.codigo,
              name: product.nome || product.descricao,
              valorBrutoBrl: product.valorBrutoBrl,
              preco: product.preco,
              valorTotalBrl: product.valorTotalBrl,
              valorEmDinheiro: product.valorEmDinheiro
            });
          });
          
          if (products.length > 0) {
            const offers = processPlans(products);
            return new Response(
              JSON.stringify({ 
                success: true, 
                data: apiData,
                offers: offers
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          } else {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: "Nenhum produto encontrado", 
                apiResponse: apiData,
                mockData: generateMockOffers(5) 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          }
        } catch (error) {
          console.error("Erro ao processar cotação:", error);
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
    } else if (path === 'beneficios') {
      // Endpoint para obter benefícios
      if (req.method === 'GET' || req.method === 'POST') {
        try {
          let requestData;
          let params = "";
          
          if (req.method === 'POST') {
            requestData = await req.json();
          } else {
            // Extrair parâmetros da URL
            params = url.search;
          }
          
          const apiResult = await makeUniversalRequest(`/beneficios${params}`, req.method, requestData);
          
          return new Response(
            JSON.stringify(apiResult),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: apiResult.success ? 200 : 400
            }
          );
        } catch (error) {
          console.error("Erro ao processar benefícios:", error);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Erro interno", 
              details: error instanceof Error ? error.message : "Erro desconhecido"
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: 500 
            }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ success: false, error: "Método não suportado para benefícios." }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 405 
          }
        );
      }
    } else if (path === 'classificacoes') {
      // Endpoint para obter classificações
      if (req.method === 'GET' || req.method === 'POST') {
        try {
          let requestData;
          
          if (req.method === 'POST') {
            requestData = await req.json();
          }
          
          const apiResult = await makeUniversalRequest('/classificacoes', req.method, requestData);
          
          return new Response(
            JSON.stringify(apiResult),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: apiResult.success ? 200 : 400
            }
          );
        } catch (error) {
          console.error("Erro ao processar classificações:", error);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Erro interno", 
              details: error instanceof Error ? error.message : "Erro desconhecido"
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: 500 
            }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ success: false, error: "Método não suportado para classificações." }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 405 
          }
        );
      }
    } else if (path === 'tipoviagem') {
      // Endpoint para obter tipos de viagem
      if (req.method === 'GET' || req.method === 'POST') {
        try {
          let requestData;
          
          if (req.method === 'POST') {
            requestData = await req.json();
          }
          
          const apiResult = await makeUniversalRequest('/tipoviagem', req.method, requestData);
          
          return new Response(
            JSON.stringify(apiResult),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: apiResult.success ? 200 : 400
            }
          );
        } catch (error) {
          console.error("Erro ao processar tipos de viagem:", error);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Erro interno", 
              details: error instanceof Error ? error.message : "Erro desconhecido"
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: 500 
            }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ success: false, error: "Método não suportado para tipos de viagem." }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 405 
          }
        );
      }
    } else if (path === 'test') {
      // Endpoint para testar a conexão com a API
      if (req.method === 'POST') {
        try {
          const requestData = await req.json();
          console.log("Dados recebidos para teste:", requestData);
          
          // Testar a API usando o endpoint de classificações
          const apiResult = await makeUniversalRequest('/classificacoes', 'GET', null, requestData.credentials);
          
          return new Response(
            JSON.stringify(apiResult),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: 200 
            }
          );
        } catch (error) {
          console.error("Erro ao testar conexão:", error);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Erro interno", 
              details: error instanceof Error ? error.message : "Erro desconhecido" 
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
    } else {
      // Generic endpoint handler for all other API paths
      if (req.method === 'GET' || req.method === 'POST' || req.method === 'PUT') {
        try {
          const fullPath = url.pathname.replace("/universal-assist/", "");
          let requestData;
          let params = "";
          
          if (req.method === 'POST' || req.method === 'PUT') {
            requestData = await req.json();
          } else {
            // Extrair parâmetros da URL
            params = url.search;
          }
          
          const apiResult = await makeUniversalRequest(`/${fullPath}${params}`, req.method, requestData);
          
          return new Response(
            JSON.stringify(apiResult),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: apiResult.success ? 200 : 400
            }
          );
        } catch (error) {
          console.error(`Erro ao processar requisição ${url.pathname}:`, error);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Erro interno", 
              details: error instanceof Error ? error.message : "Erro desconhecido"
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: 500 
            }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Método não suportado ou endpoint não encontrado.",
            availableEndpoints: ['/cotacao', '/beneficios', '/classificacoes', '/tipoviagem', '/test']
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 405 
          }
        );
      }
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
