
import { InsuranceOffer } from "../../types";
import { UniversalProduct } from "./types";

// Função para extrair o valor de preço de um produto
export const extractPrice = (product: UniversalProduct): number => {
  // Lista de possíveis campos de preço na ordem de prioridade
  const priceFields = [
    'preco',
    'valorBrutoBrl',
    'valorTotalBrl', 
    'valorEmDinheiro',
    'valorBruto',
    'valorTotal',
    'price'
  ];
  
  // Tentar cada campo até encontrar um valor válido
  for (const field of priceFields) {
    if (product[field] !== undefined && product[field] !== null) {
      // Converter para número se for string
      if (typeof product[field] === 'string') {
        const cleanedValue = String(product[field]).replace(/[^\d.,]/g, '').replace(',', '.');
        const parsedValue = parseFloat(cleanedValue);
        if (!isNaN(parsedValue)) {
          return parsedValue;
        }
      } else if (typeof product[field] === 'number') {
        return product[field];
      }
    }
  }
  
  // Valor padrão caso nenhum campo tenha sido encontrado
  console.warn("Não foi possível extrair o preço do produto:", product);
  return 0;
};

// Função para extrair o valor de cobertura médica de um produto
export const extractMedicalCoverage = (product: UniversalProduct): number => {
  // Verificar se existe uma propriedade de cobertura médica direta
  if (typeof product.coberturaMedica === 'number') {
    return product.coberturaMedica;
  }
  
  if (typeof product.coberturaMedica === 'string') {
    const parsedValue = parseFloat(String(product.coberturaMedica).replace(/[^\d.,]/g, '').replace(',', '.'));
    if (!isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  
  // Verificar na lista de coberturas
  if (product.coberturas) {
    let medicalCoverage = 0;
    
    // Se coberturas for um array
    if (Array.isArray(product.coberturas)) {
      const medicalCoverageItem = product.coberturas.find(
        c => (c.tipo?.toLowerCase()?.includes('medic') || 
              c.nome?.toLowerCase()?.includes('medic') ||
              c.descricao?.toLowerCase()?.includes('medic'))
      );
      
      if (medicalCoverageItem) {
        const value = medicalCoverageItem.valor || 
                      medicalCoverageItem.valorCoberto ||
                      medicalCoverageItem.valorCobertura || 
                      medicalCoverageItem.value;
        
        if (value) {
          if (typeof value === 'number') {
            return value;
          } else if (typeof value === 'string') {
            const parsedValue = parseFloat(String(value).replace(/[^\d.,]/g, '').replace(',', '.'));
            if (!isNaN(parsedValue)) {
              return parsedValue;
            }
          }
        }
      }
    } 
    // Se coberturas for um objeto
    else if (typeof product.coberturas === 'object') {
      const keys = Object.keys(product.coberturas);
      const medicalKey = keys.find(k => k.toLowerCase().includes('medic'));
      
      if (medicalKey && product.coberturas[medicalKey]) {
        const value = product.coberturas[medicalKey].valor || 
                      product.coberturas[medicalKey].valorCoberto ||
                      product.coberturas[medicalKey];
                      
        if (value) {
          if (typeof value === 'number') {
            return value;
          } else if (typeof value === 'string') {
            const parsedValue = parseFloat(String(value).replace(/[^\d.,]/g, '').replace(',', '.'));
            if (!isNaN(parsedValue)) {
              return parsedValue;
            }
          }
        }
      }
    }
  }
  
  // Valor padrão caso não encontre cobertura médica
  return 30000;
};

// Função para extrair benefícios de um produto
export const extractBenefits = (product: UniversalProduct): string[] => {
  const benefits: string[] = [];
  
  // Verificar benefícios em formato de array
  if (product.beneficios && Array.isArray(product.beneficios)) {
    product.beneficios.forEach(b => {
      if (typeof b === 'string') {
        benefits.push(b);
      } else if (typeof b === 'object' && b !== null) {
        const name = b.nome || b.descricao || b.name;
        if (name) {
          benefits.push(name);
        }
      }
    });
  }
  
  // Verificar caracteristicas em formato de array
  if (product.caracteristicas && Array.isArray(product.caracteristicas)) {
    product.caracteristicas.forEach(c => {
      if (typeof c === 'string') {
        benefits.push(c);
      } else if (typeof c === 'object' && c !== null) {
        const name = c.nome || c.descricao || c.name;
        if (name) {
          benefits.push(name);
        }
      }
    });
  }
  
  // Benefícios padrão se não encontrar nenhum
  if (benefits.length === 0) {
    benefits.push("COVID-19", "Telemedicina", "Assistência 24h");
  }
  
  return benefits;
};

// Função principal para processar os planos
export const processPlans = async (products: UniversalProduct[]): Promise<InsuranceOffer[]> => {
  try {
    console.log(`Processando ${products.length} produtos...`);
    
    return products.map((product, index) => {
      // Extrair preço
      const price = extractPrice(product);
      
      // Extrair cobertura médica
      const medicalCoverage = extractMedicalCoverage(product);
      
      // Calcular coberturas secundárias baseadas na principal
      const baggageCoverage = Math.min(medicalCoverage * 0.05, 1500);
      const cancellationCoverage = Math.min(medicalCoverage * 0.1, 3000);
      const delayCoverage = Math.min(medicalCoverage * 0.01, 300);
      
      // Extrair benefícios
      const benefits = extractBenefits(product);
      
      // Criar oferta
      const offer: InsuranceOffer = {
        id: product.id || product.codigo || `universal-${Math.random().toString(36).substring(2, 9)}`,
        providerId: "universal-assist",
        name: product.nome || product.descricao || `Plano Universal ${index + 1}`,
        price: price,
        coverage: {
          medical: medicalCoverage,
          baggage: baggageCoverage,
          cancellation: cancellationCoverage,
          delay: delayCoverage
        },
        benefits: benefits,
        rating: 4.5 + (Math.random() * 0.5),
        recommended: index === 0
      };
      
      return offer;
    });
  } catch (error) {
    console.error("Erro ao processar planos:", error);
    throw new Error("Falha ao processar os planos de seguro: " + (error instanceof Error ? error.message : "Erro desconhecido"));
  }
};

// Função para gerar ofertas mockadas (apenas para testes)
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
