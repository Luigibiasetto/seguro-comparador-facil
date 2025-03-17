
import { getClassifications } from "./metadata";

// Função para testar a conexão com a API
export const testConnection = async (): Promise<{ success: boolean, message: string, data?: any }> => {
  try {
    const classifications = await getClassifications();
    return {
      success: true,
      message: "Conexão com a API estabelecida com sucesso",
      data: classifications
    };
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido ao testar conexão"
    };
  }
};
