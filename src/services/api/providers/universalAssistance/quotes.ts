
import { toast } from "sonner";
import { fetchUniversalPost } from "./base";
import { calculateBirthDate, getDestinationCode } from "./base";
import { UniversalQuotePayload, UniversalQuoteResponse } from "./types";
import { SearchParams } from "../../types";

// POST /v1/Cotacao - Cotação de seguro
export const getQuote = async (payload: UniversalQuotePayload): Promise<UniversalQuoteResponse> => {
  try {
    console.log("Enviando requisição de cotação com payload:", payload);
    
    if (!payload.destinos || !payload.passageiros || !payload.dataSaida || !payload.dataRetorno) {
      throw new Error("Payload de cotação incompleto. Verifique os campos obrigatórios.");
    }
    
    const response = await fetchUniversalPost<UniversalQuoteResponse>('/Cotacao', payload);
    console.log("Resposta da cotação:", response);
    
    // Log detalhado dos produtos e seus valores para debugging
    if (response.produtos && response.produtos.length > 0) {
      console.log("Detalhamento dos produtos recebidos:");
      response.produtos.forEach((produto, index) => {
        console.log(`Produto ${index + 1} - ${produto.nome || 'Sem nome'}:`);
        console.log(` - Código: ${produto.codigo}`);
        console.log(` - valorBrutoBrl: ${produto.valorBrutoBrl}`);
        console.log(` - preco: ${produto.preco}`);
        console.log(` - valorTotalBrl: ${produto.valorTotalBrl}`);
        console.log(` - valorEmDinheiro: ${produto.valorEmDinheiro}`);
        
        // Verificar coberturas específicas
        if (produto.coberturas) {
          console.log(` - Coberturas:`, produto.coberturas);
        }
        
        // Verificar onde o valor pode estar
        const possibleValues = [];
        if (produto.valorBrutoBrl !== undefined) possibleValues.push(["valorBrutoBrl", produto.valorBrutoBrl]);
        if (produto.preco !== undefined) possibleValues.push(["preco", produto.preco]);
        if (produto.valorTotalBrl !== undefined) possibleValues.push(["valorTotalBrl", produto.valorTotalBrl]);
        if (produto.valorEmDinheiro !== undefined) possibleValues.push(["valorEmDinheiro", produto.valorEmDinheiro]);
        
        console.log(` - Valores encontrados:`, possibleValues);
      });
    }
    
    return response;
  } catch (error) {
    console.error("Erro ao obter cotação:", error);
    toast.error("Erro ao obter cotação de seguro: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    throw error;
  }
};

// Função para preparar o payload de cotação conforme documentação
export const prepareQuotePayload = (params: SearchParams): UniversalQuotePayload => {
  // Ajustes para formato ISO 8601 completo
  const departureDate = new Date(params.departureDate);
  const returnDate = new Date(params.returnDate);
  
  // Garantir que as datas estão em formato correto
  const departureFormatted = departureDate.toISOString();
  const returnFormatted = returnDate.toISOString();
  
  // Criar dados dos passageiros
  const passageiros = params.passengers.ages.map(age => {
    return {
      nome: `Passageiro ${age} anos`,
      dataNascimento: calculateBirthDate(age)
    };
  });
  
  // tipoViagem: 0 para nacional, 1 para internacional
  const tipoViagem = params.destination === "BR" ? 0 : 1;
  const destinos = [getDestinationCode(params.destination)];
  
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
