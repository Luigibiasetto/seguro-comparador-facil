
import { toast } from "sonner";
import { fetchUniversalPost } from "./base";
import { calculateBirthDate, getDestinationCode } from "./base";
import { UniversalQuotePayload, UniversalQuoteResponse } from "./types";
import { SearchParams } from "../../types";

// POST /v1/Cotacao - Cotação de seguro
export const getQuote = async (payload: UniversalQuotePayload): Promise<UniversalQuoteResponse> => {
  try {
    console.log("Enviando requisição de cotação com payload:", JSON.stringify(payload, null, 2));
    
    if (!payload.destinos || !payload.passageiros || !payload.dataSaida || !payload.dataRetorno) {
      throw new Error("Payload de cotação incompleto. Verifique os campos obrigatórios.");
    }
    
    // Adicionar login e senha diretamente no payload como exigido pela API
    const response = await fetchUniversalPost<UniversalQuoteResponse>('/Cotacao', payload);
    console.log("Resposta da cotação:", JSON.stringify(response, null, 2));
    
    // Verificação detalhada da resposta
    if (!response) {
      console.error("Resposta vazia da API");
      throw new Error("A API retornou uma resposta vazia");
    }
    
    // Verificar mensagens de erro na resposta
    if (response.message && typeof response.message === 'string') {
      console.warn("Mensagem da API:", response.message);
      
      if (response.message.includes("erro") || 
          response.message.includes("nenhum produto") || 
          response.message.includes("Nenhum produto")) {
        console.error("Erro retornado pela API:", response.message);
        throw new Error(response.message);
      }
    }
    
    // Verificar onde os produtos estão na resposta
    let produtos = null;
    
    if (response.produtos && response.produtos.length > 0) {
      produtos = response.produtos;
      console.log(`Encontrados ${produtos.length} produtos na chave 'produtos'`);
    } else if (response.planos && response.planos.length > 0) {
      produtos = response.planos;
      console.log(`Encontrados ${produtos.length} produtos na chave 'planos'`);
    } else if (Array.isArray(response) && response.length > 0) {
      produtos = response;
      console.log(`Encontrados ${produtos.length} produtos no array raiz`);
    }
    
    if (!produtos || produtos.length === 0) {
      console.error("Nenhum produto encontrado na resposta");
      throw new Error("Nenhum produto encontrado na resposta da API");
    }
    
    // Log detalhado dos produtos e seus valores para debugging
    console.log("Detalhamento dos produtos recebidos:");
    produtos.forEach((produto, index) => {
      console.log(`Produto ${index + 1} - ${produto.nome || produto.descricao || 'Sem nome'}:`);
      console.log(` - Código: ${produto.codigo || 'Sem código'}`);
      
      // Verificar todos os possíveis campos de preço
      const priceFields = [
        'valorBrutoBrl', 'preco', 'valorTotalBrl', 'valorEmDinheiro', 
        'valorBruto', 'valor', 'valorTotal', 'price'
      ];
      
      priceFields.forEach(field => {
        if (produto[field] !== undefined) {
          const value = typeof produto[field] === 'string' 
            ? parseFloat(produto[field]) 
            : produto[field];
          console.log(` - ${field}: ${value}`);
        }
      });
      
      // Verificar coberturas específicas
      if (produto.coberturas) {
        console.log(` - Coberturas:`, produto.coberturas);
      }
      
      // Verificar benefícios
      if (produto.beneficios) {
        console.log(` - Benefícios:`, produto.beneficios);
      }
    });
    
    return {
      ...response,
      produtos: produtos
    };
  } catch (error) {
    console.error("Erro ao obter cotação:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    toast.error("Erro ao obter cotação de seguro: " + errorMessage, {
      duration: 5000
    });
    throw error;
  }
};

// Função para preparar o payload de cotação conforme documentação
export const prepareQuotePayload = (params: SearchParams): UniversalQuotePayload => {
  try {
    // Ajustes para formato ISO 8601 completo
    const departureDate = new Date(params.departureDate);
    const returnDate = new Date(params.returnDate);
    
    // Garantir que as datas estão em formato correto
    // Usar formato YYYY-MM-DD que é mais comumente aceito pelas APIs
    const formatDateForApi = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}T00:00:00`;
    };
    
    const departureFormatted = formatDateForApi(departureDate);
    const returnFormatted = formatDateForApi(returnDate);
    
    console.log("Data de partida formatada:", departureFormatted);
    console.log("Data de retorno formatada:", returnFormatted);
    
    // Criar dados dos passageiros
    const passageiros = params.passengers.ages.map(age => {
      const birthDate = calculateBirthDate(age);
      console.log(`Passageiro com ${age} anos, data de nascimento: ${birthDate}`);
      return {
        nome: `Passageiro ${age} anos`,
        dataNascimento: birthDate
      };
    });
    
    // tipoViagem: 0 para nacional, 1 para internacional
    const tipoViagem = params.destination === "BR" ? 0 : 1;
    const destinos = [getDestinationCode(params.destination)];
    
    console.log("Destinos:", destinos);
    console.log("Tipo de viagem:", tipoViagem);
    
    // Ajustado para incluir todos os campos obrigatórios e opcionais conforme documentação
    return {
      destinos: destinos,
      passageiros: passageiros,
      dataSaida: departureFormatted,
      dataRetorno: returnFormatted,
      tipoViagem: tipoViagem,
      tipoTarifa: 1,  // 1 para Folheto (padrão)
      produtoAvulso: false,
      cupom: "",
      classificacoes: [1],  // 1 = "Todos" 
      valorTotalPacote: 0,
      codigoOperacao: 0,
      canalDeVenda: 0,
      multiviagem: false,
      idCotacao: 0
    };
  } catch (error) {
    console.error("Erro ao preparar payload:", error);
    throw new Error("Erro ao preparar dados para cotação: " + (error instanceof Error ? error.message : "Erro desconhecido"));
  }
};

// Função para obter a URL do voucher
export const getVoucherUrl = async (codigoCarrinho: string): Promise<string> => {
  try {
    const response = await fetchUniversalPost<{urlVoucher: string}>(`/Voucher/imprimir/${codigoCarrinho}`, {});
    return response.urlVoucher;
  } catch (error) {
    console.error("Erro ao obter URL do voucher:", error);
    throw error;
  }
};
