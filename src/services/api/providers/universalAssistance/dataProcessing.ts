
import { InsuranceOffer } from "../../../api/types";
import { UniversalProduct, UniversalBenefit } from "./types";

// Função para extrair o valor correto do produto
function extractPrice(product: UniversalProduct): number {
  // Verificamos em ordem específica baseada na documentação
  if (typeof product.valorBrutoBrl === 'number' && product.valorBrutoBrl > 0) {
    return product.valorBrutoBrl;
  }
  
  if (typeof product.preco === 'number' && product.preco > 0) {
    return product.preco;
  }
  
  // Também verificamos outros campos que podem conter o valor
  if (typeof product.valorTotalBrl === 'number' && product.valorTotalBrl > 0) {
    return product.valorTotalBrl;
  }
  
  if (typeof product.valorEmDinheiro === 'number' && product.valorEmDinheiro > 0) {
    return product.valorEmDinheiro;
  }
  
  // Tentar converter de string para número se estivermos lidando com strings
  if (typeof product.preco === 'string') {
    const parsedPrice = parseFloat(product.preco);
    if (!isNaN(parsedPrice) && parsedPrice > 0) return parsedPrice;
  }
  
  if (typeof product.valorBrutoBrl === 'string') {
    const parsedValue = parseFloat(String(product.valorBrutoBrl));
    if (!isNaN(parsedValue) && parsedValue > 0) return parsedValue;
  }
  
  if (typeof product.valorTotalBrl === 'string') {
    const parsedValue = parseFloat(String(product.valorTotalBrl));
    if (!isNaN(parsedValue) && parsedValue > 0) return parsedValue;
  }
  
  if (typeof product.valorEmDinheiro === 'string') {
    const parsedValue = parseFloat(String(product.valorEmDinheiro));
    if (!isNaN(parsedValue) && parsedValue > 0) return parsedValue;
  }
  
  // Se não encontrarmos valor válido, retornamos zero e log de aviso
  console.warn(`Nenhum valor válido encontrado para o produto ${product.codigo || 'desconhecido'}`);
  return 0;
}

// Função para extrair coberturas
function extractCoverage(product: UniversalProduct, type: string, defaultValue: number): number {
  // Tentar extrair cobertura dos diferentes formatos possíveis de resposta
  if (product.coberturas) {
    const cobertura = Array.isArray(product.coberturas)
      ? product.coberturas.find((c: any) => 
          c.tipo?.toLowerCase() === type || 
          c.nome?.toLowerCase().includes(type))
      : product.coberturas[type];
      
    if (cobertura) {
      // Corrigido: Converter para string antes de usar parseFloat
      const valorStr = cobertura.valor?.toString() || cobertura.valorCoberto?.toString() || "0";
      return parseFloat(valorStr) || defaultValue;
    }
  }
  
  // Verificar estruturas alternativas
  if (product[`cobertura${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof UniversalProduct]) {
    const value = product[`cobertura${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof UniversalProduct];
    // Corrigido: Converter para string antes de usar parseFloat
    return typeof value === 'number' ? value : parseFloat(String(value)) || defaultValue;
  }
  
  return defaultValue;
}

// Função para extrair benefícios
function extractBenefits(product: UniversalProduct): string[] {
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
export const processPlans = async (products: UniversalProduct[]): Promise<InsuranceOffer[]> => {
  return products.map((product: UniversalProduct, index: number) => {
    // Log detalhado para cada produto antes de extrair o valor
    console.log(`Processando produto ${index + 1}:`, {
      id: product.codigo,
      name: product.nome || product.descricao,
      valorBrutoBrl: product.valorBrutoBrl,
      preco: product.preco,
      valorTotalBrl: product.valorTotalBrl,
      valorEmDinheiro: product.valorEmDinheiro
    });
    
    const extractedPrice = extractPrice(product);
    console.log(`Valor extraído para o produto ${product.codigo || index}: ${extractedPrice}`);
    
    return {
      id: product.codigo || `universal-${Math.random().toString(36).substring(2, 9)}`,
      providerId: "universal-assist",
      name: product.nome || product.descricao || `Plano Universal ${index + 1}`,
      price: extractedPrice || 0, // Garantir que sempre tenha um valor, mesmo que zero
      coverage: {
        medical: extractCoverage(product, 'medical', 40000),
        baggage: extractCoverage(product, 'baggage', 1000),
        cancellation: extractCoverage(product, 'cancellation', 2000),
        delay: extractCoverage(product, 'delay', 200),
      },
      benefits: extractBenefits(product),
      rating: 4.5 + (Math.random() * 0.5),
      recommended: index === 0,
    };
  });
};

// Função para gerar ofertas mockadas
export const generateMockOffers = (count: number): InsuranceOffer[] => {
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
};
