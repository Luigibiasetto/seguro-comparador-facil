
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Check, Bug } from "lucide-react";
import { toast } from "sonner";
import { configureInsuranceAPI } from "@/services/api/config";
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
      
      const testHeaders = {
        'Origin': window.location.origin,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      };
      
      // Teste de conectividade genérica
      const testUrl = "https://jsonplaceholder.typicode.com/todos/1";
      const testResponse = await fetch(testUrl);
      
      if (!testResponse.ok) {
        toast.error("Falha no teste de conectividade básica. Verifique sua conexão com a internet.", {
          id: "api-test",
        });
        return;
      }
      
      // Formatando a URL para o teste
      let apiTestUrl = baseUrl;
      if (!apiTestUrl.endsWith('/')) apiTestUrl += '/';
      
      // Se usar proxy, adicione-o
      if (useProxy) {
        apiTestUrl = `${proxyUrl}${encodeURIComponent(apiTestUrl)}`;
      }
      
      toast.info(`Testando: ${apiTestUrl}`, {
        id: "api-test",
        duration: 5000,
      });
      
      // Tente acessar a API (sem autenticação, apenas para testar alcançabilidade)
      try {
        const apiResponse = await fetch(apiTestUrl, {
          method: 'GET',
          headers: testHeaders,
          mode: 'cors'
        });
        
        const status = apiResponse.status;
        
        if (status === 200 || status === 401 || status === 403) {
          // Códigos 401/403 são OK para esse teste, significa que a API está acessível mas requer auth
          toast.success(`Conexão com API estabelecida! Status: ${status}`, {
            id: "api-test",
            description: "A API está acessível. Códigos 401/403 são esperados se autenticação for necessária."
          });
        } else {
          toast.warning(`API respondeu com status: ${status}`, {
            id: "api-test",
            description: "A API foi contactada, mas retornou um status inesperado."
          });
        }
        
        // Tente obter mais informações sobre o erro
        try {
          const responseText = await apiResponse.text();
          console.log("Resposta da API:", responseText);
          
          if (debugMode) {
            toast.info("Resposta detalhada da API (modo debug)", {
              description: responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""),
              duration: 10000
            });
          }
        } catch (textError) {
          console.error("Erro ao obter texto da resposta:", textError);
        }
        
      } catch (apiError) {
        console.error("Erro ao conectar com a API:", apiError);
        toast.error("Falha ao conectar com a API", {
          id: "api-test",
          description: `Erro: ${apiError instanceof Error ? apiError.message : "Desconhecido"}` 
        });
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
          'Pragma': 'no-cache'
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
