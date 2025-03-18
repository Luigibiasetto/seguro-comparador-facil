
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
  const departureFormatted = new Date(params.departureDate).toISOString().split('T')[0];
  const returnFormatted = new Date(params.returnDate).toISOString().split('T')[0];
  
  const passageiros = params.passengers.ages.map(age => {
    return {
      nome: `Passageiro ${age} anos`,
      dataNascimento: calculateBirthDate(age)
    };
  });
  
  // tipoViagem: 0 para nacional, 1 para internacional
  const tipoViagem = params.destination === "BR" ? 0 : 1;
  const destinos = [getDestinationCode(params.destination)];
  
  return {
    destinos: destinos,
    passageiros: passageiros,
    dataSaida: departureFormatted,
    dataRetorno: returnFormatted,
    tipoViagem: tipoViagem,
    tipoTarifa: 1,  // 1 para Folheto (padrão) conforme documentação
    produtoAvulso: false,
    cupom: "",
    classificacoes: [1]  // 1 = "Todos" conforme documentação
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
