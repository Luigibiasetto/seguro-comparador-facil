
import { InsuranceOffer } from "../../types";
import { UniversalProduct, UniversalBenefit } from "./types";
import { getProductBenefits } from "./api";

// Helper function to extract coverage values
export const extractCoverage = (product: UniversalProduct, type: string, defaultValue: number): number => {
  // Tentar extrair cobertura dos diferentes formatos possíveis de resposta
  if (product.coberturas) {
    if (Array.isArray(product.coberturas)) {
      const cobertura = product.coberturas.find((c: any) => 
        c.tipo?.toLowerCase() === type || 
        c.nome?.toLowerCase().includes(type));
        
      if (cobertura) {
        return parseFloat(cobertura.valor || cobertura.valorCoberto || "0") || defaultValue;
      }
    } else if (typeof product.coberturas === 'object') {
      // Tenta buscar no formato de objeto
      const coverageKey = Object.keys(product.coberturas).find(key => 
        key.toLowerCase().includes(type));
        
      if (coverageKey && product.coberturas[coverageKey]) {
        const value = product.coberturas[coverageKey];
        return typeof value === 'number' ? value : 
               typeof value === 'string' ? parseFloat(value) || defaultValue :
               typeof value === 'object' && value.valor ? parseFloat(value.valor) || defaultValue :
               defaultValue;
      }
    }
  }
  
  // Verificar estruturas alternativas
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  if (product[`cobertura${capitalizedType}`]) {
    return parseFloat(product[`cobertura${capitalizedType}`]) || defaultValue;
  }
  
  return defaultValue;
};

// Helper function to extract benefits
export const extractBenefits = (product: UniversalProduct): string[] => {
  // Primeiro verificamos se o produto tem benefícios
  if (product.beneficios) {
    if (Array.isArray(product.beneficios)) {
      return product.beneficios.map((b: any) => {
        if (typeof b === 'string') return b;
        return b.nome || b.descricao || "Benefício";
      });
    } else if (typeof product.beneficios === 'object') {
      // Se for um objeto, extraímos os valores
      return Object.values(product.beneficios).map((b: any) => {
        if (typeof b === 'string') return b;
        return b.nome || b.descricao || "Benefício";
      });
    }
  }
  
  // Verificamos características como alternativa
  if (product.caracteristicas) {
    if (Array.isArray(product.caracteristicas)) {
      return product.caracteristicas.map((c: any) => {
        if (typeof c === 'string') return c;
        return c.nome || c.descricao || "Característica";
      });
    }
  }
  
  // Benefícios padrão se nada for encontrado
  return ["COVID-19", "Telemedicina", "Assistência 24h", "Traslado médico"];
};

// Função que usa as APIs para enriquecer os benefícios do produto
export const enrichProductBenefits = async (product: UniversalProduct): Promise<string[]> => {
  try {
    // Primeiro extraímos os benefícios do próprio produto
    const initialBenefits = extractBenefits(product);
    
    // Tentamos buscar benefícios adicionais da API
    if (product.id) {
      const apiBenefits = await getProductBenefits(product.id);
      
      if (apiBenefits && apiBenefits.length > 0) {
        // Combinamos os benefícios, removendo duplicatas
        const allBenefits = [
          ...initialBenefits,
          ...apiBenefits.map(b => b.nome || b.descricao)
        ];
        
        // Removemos duplicatas
        const uniqueBenefits = Array.from(new Set(allBenefits));
        return uniqueBenefits.filter(b => b); // Remove itens vazios
      }
    }
    
    return initialBenefits;
  } catch (error) {
    console.error("Erro ao enriquecer benefícios do produto:", error);
    return extractBenefits(product);
  }
};

// Helper function to process API plans into the app's format
export const processPlans = async (products: UniversalProduct[]): Promise<InsuranceOffer[]> => {
  const processedOffers: InsuranceOffer[] = [];
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    // Enriquecemos os benefícios buscando da API
    const enrichedBenefits = await enrichProductBenefits(product);
    
    processedOffers.push({
      id: product.id || product.codigo || `universal-${Math.random().toString(36).substring(2, 9)}`,
      providerId: "universal-assist",
      name: product.nome || product.descricao || `Plano Universal ${i + 1}`,
      price: parseFloat(product.preco?.toString() || product.valorBruto?.toString() || "0") || Math.floor(Math.random() * 300) + 100,
      coverage: {
        medical: extractCoverage(product, 'medical', 40000),
        baggage: extractCoverage(product, 'baggage', 1000),
        cancellation: extractCoverage(product, 'cancellation', 2000),
        delay: extractCoverage(product, 'delay', 200),
      },
      benefits: enrichedBenefits,
      rating: 4.5 + (Math.random() * 0.5),
      recommended: i === 0,
    });
  }
  
  return processedOffers;
};

// Função para gerar ofertas mockadas (usado em caso de falhas)
export const generateMockOffers = (count: number): InsuranceOffer[] => {
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
