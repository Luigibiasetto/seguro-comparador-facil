
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
  
  const tipoViagem = params.destination === "BR" ? 0 : 1;
  const destinos = [getDestinationCode(params.destination)];
  
  return {
    destinos: destinos,
    passageiros: passageiros,
    dataSaida: departureFormatted,
    dataRetorno: returnFormatted,
    tipoViagem: tipoViagem,
    tipoTarifa: 1,  // 1 para Folheto (padrão)
    produtoAvulso: false,
    cupom: "",
    classificacoes: [1]  // 1 = "Todos" conforme documentação
  };
};
