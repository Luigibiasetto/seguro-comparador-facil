
import { toast } from "sonner";
import { getApiConfig, getApiUrl, tryWithMultipleProxies } from "../config";
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

    // Configurar headers com as credenciais conforme documentação
    const headers = {
      ...(apiConfig.headers || {}),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Login': apiConfig.providerSettings.username,  // Usar "Login" conforme documentação
      'Senha': apiConfig.providerSettings.password,  // Usar "Senha" conforme documentação
      'Origin': window.location.origin,
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Referrer-Policy': 'no-referrer'
    };

    console.log("Headers configurados:", headers);
    console.log("URL de origem:", window.location.origin);

    // Preparar parâmetros de busca com o formato correto conforme documentação
    const departureFormatted = new Date(params.departureDate).toISOString().split('T')[0];
    const returnFormatted = new Date(params.returnDate).toISOString().split('T')[0];
    const tripDuration = calculateTripDuration(params.departureDate, params.returnDate);
    
    // Converter idades dos passageiros para o formato esperado pela API
    const passageiros = params.passengers.ages.map(age => {
      return {
        nome: `Passageiro ${age} anos`,
        dataNascimento: calculateBirthDate(age)
      };
    });
    
    // Payload conforme documentação
    const cotacaoPayload = {
      destinos: [getDestinationCode(params.destination)],
      passageiros: passageiros,
      dataSaida: departureFormatted,
      dataRetorno: returnFormatted,
      tipoViagem: 1, // Internacional
      tipoTarifa: 1, // Folheto
      produtoAvulso: false,
      cupom: "",
      classificacoes: [1] // Default, pode ser ajustado
    };
    
    console.log("Payload de cotação:", cotacaoPayload);
    
    // Função para fazer a chamada à API
    const fetchPlans = async (proxyUrl?: string) => {
      const cotacaoUrl = getApiUrl('/Cotacao', proxyUrl);
      console.log(`Tentando buscar cotação em: ${cotacaoUrl}`);
      
      try {
        const response = await fetch(cotacaoUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(cotacaoPayload),
          mode: 'cors'
        });
        
        if (!response.ok) {
          console.warn(`Falha na cotação: ${response.status}`);
          const errorText = await response.text();
          console.log("Detalhes do erro:", errorText);
          return null;
        }
        
        const data = await response.json();
        console.log("Dados obtidos:", data);
        
        if (data && (data.produtos || data.planos)) {
          // Processar os planos retornados
          const products = data.produtos || data.planos || [];
          return processPlans(products);
        }
        
        return null;
      } catch (error) {
        console.warn("Erro ao buscar cotação:", error);
        if (apiConfig.debugMode) {
          toast.error("Erro ao buscar cotação", {
            description: `${error}`,
            duration: 5000
          });
        }
        return null;
      }
    };
    
    // Tentativa com proxy se configurado, ou diretamente
    let plans = null;
    
    if (apiConfig.useProxy) {
      // Com proxy
      try {
        plans = await tryWithMultipleProxies(fetchPlans);
      } catch (proxyError) {
        console.error("Todas as tentativas com proxy falharam:", proxyError);
      }
    } else {
      // Sem proxy
      try {
        plans = await fetchPlans();
      } catch (directError) {
        console.error("Tentativa direta falhou:", directError);
      }
    }
    
    // Se encontrou planos, retorna eles
    if (plans && plans.length > 0) {
      console.log(`Encontrados ${plans.length} planos.`);
      return plans;
    }
    
    // Tentativa via Edge Function do Supabase
    if (apiConfig.useSupabase) {
      console.log("Tentando cotação via Edge Function do Supabase");
      try {
        const { data: edgeFunctionData, error } = await fetch("/api/universal-assist/cotacao", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credentials: {
              login: apiConfig.providerSettings.username,
              senha: apiConfig.providerSettings.password
            },
            payload: cotacaoPayload
          }),
        }).then(res => res.json());
        
        if (error) {
          console.error("Erro na Edge Function:", error);
        } else if (edgeFunctionData && edgeFunctionData.success && edgeFunctionData.offers) {
          console.log("Dados obtidos via Edge Function:", edgeFunctionData);
          return edgeFunctionData.offers;
        }
      } catch (edgeFunctionError) {
        console.error("Erro ao chamar Edge Function:", edgeFunctionError);
      }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    console.warn("Todas as tentativas de conexão falharam. Usando dados mockados.");
    
    // Mensagens de erro específicas baseadas na configuração
    if (apiConfig.useProxy) {
      toast.error("Não foi possível conectar à API da Universal Assistance mesmo usando proxy.", {
        description: "A API pode estar indisponível ou as credenciais podem estar incorretas.",
        duration: 8000
      });
    } else {
      toast.error("Não foi possível conectar à API da Universal Assistance.", {
        description: "Tente ativar a opção de proxy CORS nas configurações da API.",
        duration: 8000
      });
    }
    
    return generateMockOffers(5);
  } catch (error) {
    console.error("Erro ao buscar dados da Universal Assistance:", error);
    toast.error("Erro ao conectar com a API da Universal Assistance", {
      description: "Verificando conectividade de rede...",
      duration: 5000
    });
    
    // Teste simples de conectividade
    try {
      const testUrl = "https://jsonplaceholder.typicode.com/todos/1";
      const testResponse = await fetch(testUrl);
      console.log("Teste de conectividade:", testResponse.ok ? "Sucesso" : "Falha");
      
      if (testResponse.ok) {
        toast.info("Conexão com internet confirmada", {
          description: "O problema pode ser específico da API da Universal Assistance ou relacionado a CORS.",
          duration: 8000
        });
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

// Função auxiliar para calcular data de nascimento baseada na idade
function calculateBirthDate(age: number): string {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  return `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// Função para converter o destino em código conforme esperado pela API
function getDestinationCode(destination: string): string {
  // Mapeamento de destinos para códigos
  const destinationMap: Record<string, string> = {
    "NAMERICA": "NA", // América do Norte
    "SAMERICA": "SA", // América do Sul
    "EUROPE": "EU",   // Europa
    "ASIA": "AS",     // Ásia
    "AFRICA": "AF",   // África
    "OCEANIA": "OC",  // Oceania
    "BR": "BR"        // Brasil
  };
  
  return destinationMap[destination] || destination;
}

// Helper function to process API plans into the app's format
const processPlans = (products: any[]): InsuranceOffer[] => {
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
};

// Helper function to extract coverage values
const extractCoverage = (product: any, type: string, defaultValue: number): number => {
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
};

// Helper function to extract benefits
const extractBenefits = (product: any): string[] => {
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
