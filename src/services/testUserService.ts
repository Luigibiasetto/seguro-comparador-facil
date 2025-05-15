
import { supabase } from "@/integrations/supabase/client";
import { createAgency } from "@/services/agencyService";

/**
 * Cria um usuário de teste para agência com credenciais predefinidas
 * Esta função deve ser executada apenas em ambiente de desenvolvimento
 */
export async function createTestAgencyUser(): Promise<{
  success: boolean;
  error?: any;
  email?: string;
  password?: string;
}> {
  const testEmail = "agencia.teste@exemplo.com";
  const testPassword = "senha123";
  
  try {
    console.log("Iniciando criação de usuário de teste para agência...");
    
    // Verificar se há conexão com o Supabase antes de continuar
    try {
      const connectionTest = await supabase.auth.getSession();
      if (connectionTest.error) {
        console.error("Erro de conexão com o Supabase:", connectionTest.error);
        return {
          success: false,
          error: {
            message: "Não foi possível conectar ao Supabase. Verifique sua conexão com a internet.",
            type: "connection_error"
          }
        };
      }
    } catch (connError) {
      console.error("Falha ao verificar conexão:", connError);
      return {
        success: false,
        error: {
          message: "Não foi possível verificar conexão com o serviço. Verifique sua conexão com a internet.",
          type: "connection_error"
        }
      };
    }
    
    // Verificar se o usuário já existe
    try {
      const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (!signInError && existingUser?.user) {
        console.log("Usuário de teste já existe, retornando credenciais");
        return {
          success: true,
          email: testEmail,
          password: testPassword
        };
      }
    } catch (signInError) {
      // Ignorar erro aqui, pois pode ser apenas que o usuário não existe
      console.log("Usuário provavelmente não existe, tentando criar:", signInError);
    }
    
    // Criar novo usuário
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) throw error;
    
    const userId = data.user?.id;
    
    if (!userId) {
      throw new Error("Falha ao obter ID do usuário após registro");
    }
    
    // Criar agência para o usuário
    const agencyResult = await createAgency(
      userId,
      "Agência de Teste",
      "12.345.678/0001-90",
      "João da Silva",
      testEmail,
      "(11) 99999-9999",
      10,
      'active' // Ativo por padrão para facilitar o teste
    );
    
    if (!agencyResult.success) {
      throw new Error("Falha ao criar agência para usuário de teste");
    }
    
    console.log("Usuário de teste para agência criado com sucesso!");
    
    return {
      success: true,
      email: testEmail,
      password: testPassword
    };
    
  } catch (error: any) {
    console.error("Erro ao criar usuário de teste:", error);
    
    // Verificar se é erro de rede
    if (error.message === "Failed to fetch" || error.code === "network_error") {
      return {
        success: false,
        error: {
          message: "Erro de conexão com o servidor. Verifique sua conexão com a internet.",
          type: "connection_error"
        }
      };
    }
    
    return {
      success: false,
      error: error
    };
  }
}
