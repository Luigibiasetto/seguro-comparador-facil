
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

// Função principal para processar as requisições
serve(async (req) => {
  // Lidar com requisições CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Extrair o caminho da requisição
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    if (path === 'cotacao') {
      // Se o método for POST, processar a cotação
      if (req.method === 'POST') {
        try {
          const requestData = await req.json();
          console.log("Dados recebidos para cotação:", requestData);
          
          if (!requestData.credentials || !requestData.credentials.login || !requestData.credentials.senha) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: "Credenciais não fornecidas", 
                mockData: generateMockOffers(5) 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          }
          
          if (!requestData.payload) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: "Payload não fornecido", 
                mockData: generateMockOffers(5) 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          }
          
          // Obter as credenciais e o payload
          const { login, senha } = requestData.credentials;
          const payload = requestData.payload;
          
          // URL da API
          const apiBaseUrl = "https://api-br.universal-assistance.com/v1";
          
          // Headers com credenciais conforme documentação
          const apiHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Login': login,
            'Senha': senha
          };
          
          console.log("Tentando cotação na Universal Assistance");
          console.log("URL:", `${apiBaseUrl}/Cotacao`);
          console.log("Headers:", apiHeaders);
          console.log("Payload:", payload);
          
          // Fazer a requisição para a API
          const apiResponse = await fetch(`${apiBaseUrl}/Cotacao`, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify(payload)
          });
          
          if (!apiResponse.ok) {
            console.log(`Erro na API: ${apiResponse.status}`);
            let errorText = "";
            try {
              errorText = await apiResponse.text();
            } catch (e) {
              errorText = "Não foi possível obter detalhes do erro";
            }
            console.log("Detalhes do erro:", errorText);
            
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: `Erro na API: ${apiResponse.status}`, 
                details: errorText,
                mockData: generateMockOffers(5) 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          }
          
          // Processar a resposta
          const apiData = await apiResponse.json();
          console.log("Resposta da API:", apiData);
          
          // Extrair os produtos/planos
          let products = [];
          if (apiData.produtos) {
            products = apiData.produtos;
          } else if (apiData.planos) {
            products = apiData.planos;
          } else if (Array.isArray(apiData)) {
            products = apiData;
          }
          
          if (products.length > 0) {
            const offers = processPlans(products);
            return new Response(
              JSON.stringify({ 
                success: true, 
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
    } else if (path === 'test') {
      // Endpoint para testar a conexão com a API
      if (req.method === 'POST') {
        try {
          const requestData = await req.json();
          console.log("Dados recebidos para teste:", requestData);
          
          if (!requestData.credentials || !requestData.credentials.login || !requestData.credentials.senha) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: "Credenciais não fornecidas" 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          }
          
          // Obter as credenciais
          const { login, senha } = requestData.credentials;
          
          // URL da API
          const apiBaseUrl = "https://api-br.universal-assistance.com/v1";
          
          // Headers com credenciais conforme documentação
          const apiHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Login': login,
            'Senha': senha
          };
          
          console.log("Testando conexão com a Universal Assistance");
          console.log("URL:", `${apiBaseUrl}/classificacoes`);
          console.log("Headers:", apiHeaders);
          
          // Tentar acessar um endpoint simples para testar a conexão
          const apiResponse = await fetch(`${apiBaseUrl}/classificacoes`, {
            method: 'GET',
            headers: apiHeaders
          });
          
          if (!apiResponse.ok) {
            console.log(`Erro na API: ${apiResponse.status}`);
            let errorText = "";
            try {
              errorText = await apiResponse.text();
            } catch (e) {
              errorText = "Não foi possível obter detalhes do erro";
            }
            console.log("Detalhes do erro:", errorText);
            
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: `Erro na API: ${apiResponse.status}`, 
                details: errorText
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
                status: 200 
              }
            );
          }
          
          // Se chegou aqui, a conexão foi bem sucedida
          const apiData = await apiResponse.json();
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Conexão bem sucedida",
              data: apiData
            }),
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
      // Se o caminho não for reconhecido
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Endpoint não encontrado",
          availableEndpoints: ['/cotacao', '/test']
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

// Função para extrair valores de cobertura
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
