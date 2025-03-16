
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Check, Bug } from "lucide-react";
import { toast } from "sonner";
import { configureInsuranceAPI, getApiConfig } from "@/services/api/config";
import UniversalAssistanceForm from "./UniversalAssistanceForm";
import ProviderSelect from "./ProviderSelect";
import GenericApiForm from "./GenericApiForm";

interface ApiConfigFormProps {
  onOpenChange: (open: boolean) => void;
}

const ApiConfigForm = ({ onOpenChange }: ApiConfigFormProps) => {
  const [apiProvider, setApiProvider] = useState<string>("universal-assist");
  const [username, setUsername] = useState("raphaelbellei");
  const [password, setPassword] = useState("Anthony25");
  const [baseUrl, setBaseUrl] = useState("https://api-br.universal-assistance.com/v1");
  const [apiKey, setApiKey] = useState("");
  const [useProxy, setUseProxy] = useState(true);
  const [proxyUrl, setProxyUrl] = useState("https://api.allorigins.win/raw?url=");
  const [debugMode, setDebugMode] = useState(true);
  
  const testConnection = async () => {
    try {
      toast.info("Testando conexão com a API...", {
        id: "api-test",
      });
      
      // Apply temporary configuration for testing
      const tempConfig = {
        provider: apiProvider,
        baseUrl: baseUrl.replace(/\/+$/, ""),
        useProxy,
        proxyUrl: useProxy ? proxyUrl : undefined,
        debugMode: true, // Force debug mode for testing
        providerSettings: {
          username,
          password
        },
        headers: {
          'Origin': window.location.origin,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Referrer-Policy': 'no-referrer'
        }
      };
      
      configureInsuranceAPI(tempConfig);
      
      const testHeaders = {
        'Origin': window.location.origin,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referrer-Policy': 'no-referrer'
      };
      
      // General connectivity test
      const testUrl = "https://jsonplaceholder.typicode.com/todos/1";
      try {
        const testResponse = await fetch(testUrl);
        
        if (!testResponse.ok) {
          toast.error("Falha no teste de conectividade básica. Verifique sua conexão com a internet.", {
            id: "api-test",
          });
          return;
        }
        
        toast.success("Conexão com internet confirmada", {
          id: "api-test-internet",
          duration: 3000
        });
      } catch (connectError) {
        toast.error("Problema de conectividade básica detectado. Verifique sua conexão de internet.", {
          id: "api-test",
        });
        return;
      }
      
      // Formatting URL for the API test
      let apiTestUrl = baseUrl;
      if (!apiTestUrl.endsWith('/')) apiTestUrl += '/';
      
      // If using proxy, add it
      if (useProxy) {
        apiTestUrl = `${proxyUrl}${encodeURIComponent(apiTestUrl)}`;
      }
      
      toast.info(`Testando API: ${apiTestUrl}`, {
        id: "api-test",
        duration: 5000,
      });
      
      // Test basic API reachability (even without authentication)
      try {
        const apiResponse = await fetch(apiTestUrl, {
          method: 'GET',
          headers: testHeaders,
          mode: 'cors'
        });
        
        const status = apiResponse.status;
        
        if (status === 200 || status === 401 || status === 403) {
          toast.success(`API acessível! Status: ${status}`, {
            id: "api-test",
            description: "A API está acessível. Códigos 401/403 são esperados se autenticação for necessária."
          });
        } else {
          toast.warning(`API respondeu com status: ${status}`, {
            id: "api-test",
            description: "A API foi contactada, mas retornou um status inesperado."
          });
        }
        
        // Try to get more information about the response
        try {
          const responseText = await apiResponse.text();
          console.log("Resposta da API:", responseText);
          
          toast.info("Resposta detalhada da API", {
            description: responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""),
            duration: 10000
          });
        } catch (textError) {
          console.error("Erro ao obter texto da resposta:", textError);
        }
        
      } catch (apiError) {
        console.error("Erro ao conectar com a API:", apiError);
        
        if (useProxy) {
          toast.error("Falha ao conectar usando o proxy atual", {
            id: "api-test",
            description: "Tente outro serviço de proxy ou desative o proxy se a API permitir acesso direto."
          });
          
          // Try without proxy as a last resort
          try {
            const directResponse = await fetch(baseUrl, {
              method: 'GET',
              headers: testHeaders
            });
            
            if (directResponse.ok || directResponse.status === 401 || directResponse.status === 403) {
              toast.success("Conexão direta com a API bem-sucedida!", {
                description: "O proxy pode ser desnecessário. Tente desativar a opção 'Usar Proxy CORS'."
              });
            }
          } catch (directError) {
            toast.error("Também falhou sem proxy. Possível problema de CORS ou API indisponível.", {
              duration: 8000
            });
          }
        } else {
          toast.error("Falha na conexão direta com a API", {
            id: "api-test",
            description: "Tente ativar o proxy CORS para resolver possíveis problemas de CORS."
          });
        }
      }
    } catch (error) {
      console.error("Erro no teste de conexão:", error);
      toast.error("Erro ao testar conexão", { 
        id: "api-test",
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Configuração baseada no provedor selecionado
      const config: any = { 
        useMock: false,
        provider: apiProvider,
        useProxy,
        proxyUrl: useProxy ? proxyUrl : undefined,
        debugMode,
        fallbackProxies: [
          "https://api.allorigins.win/raw?url=",
          "https://corsproxy.io/?",
          "https://cors-proxy.htmldriven.com/?url=",
          "https://cors.bridged.cc/",
          "https://proxy.cors.sh/"
        ]
      };
      
      if (apiProvider === "universal-assist") {
        // Verificar credenciais para Universal Assistance
        if (!username || !password || !baseUrl) {
          toast.error("Por favor, preencha todos os campos da Universal Assistance (URL base, usuário e senha).");
          return;
        }
        
        // Ensure baseUrl doesn't have trailing slashes
        config.baseUrl = baseUrl.replace(/\/+$/, "");
        config.providerSettings = {
          username,
          password
        };
        
        // Add additional headers that might be needed
        config.headers = {
          'Origin': window.location.origin,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Referrer-Policy': 'no-referrer'
        };
      } else if (apiProvider === "custom") {
        // Verificar URL base para API personalizada
        if (!baseUrl) {
          toast.error("Por favor, informe a URL base da API personalizada.");
          return;
        }
        
        config.baseUrl = baseUrl.replace(/\/+$/, "");
        if (apiKey) {
          config.apiKey = apiKey;
        }
      }
      
      configureInsuranceAPI(config);
      
      toast.success(`API ${apiProvider === "universal-assist" ? "da Universal Assistance" : "personalizada"} configurada com sucesso!`);
      
      // Se estiver na página de resultados, sugerir atualização
      if (window.location.pathname.includes('resultados')) {
        toast.info("Recarregando a página para aplicar as novas configurações...");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.info("Se você estiver na página de resultados, atualize a página para aplicar as configurações.");
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao configurar API:", error);
      toast.error("Ocorreu um erro ao configurar a API.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <ProviderSelect
        value={apiProvider}
        onValueChange={setApiProvider}
      />

      {apiProvider === "universal-assist" ? (
        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-sm font-medium mb-3">Universal Assistance API</h3>
          <UniversalAssistanceForm 
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            baseUrl={baseUrl}
            setBaseUrl={setBaseUrl}
            useProxy={useProxy}
            setUseProxy={setUseProxy}
            proxyUrl={proxyUrl}
            setProxyUrl={setProxyUrl}
            debugMode={debugMode}
            setDebugMode={setDebugMode}
          />
        </div>
      ) : (
        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-sm font-medium mb-3">API Personalizada</h3>
          <GenericApiForm 
            baseUrl={baseUrl}
            setBaseUrl={setBaseUrl}
            apiKey={apiKey}
            setApiKey={setApiKey}
            disabled={false}
          />
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={testConnection}
          className="gap-1"
        >
          <Bug className="w-4 h-4" />
          Testar Conexão
        </Button>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit">
          <Check className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ApiConfigForm;
