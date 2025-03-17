
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Check, Bug, Database, AlertTriangle, Globe } from "lucide-react";
import { toast } from "sonner";
import { configureInsuranceAPI, getApiConfig } from "@/services/api/config";
import UniversalAssistanceForm from "./UniversalAssistanceForm";
import ProviderSelect from "./ProviderSelect";
import GenericApiForm from "./GenericApiForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { testConnection } from "@/services/api/providers/universalAssistance/api";

interface ApiConfigFormProps {
  onOpenChange: (open: boolean) => void;
}

const ApiConfigForm = ({ onOpenChange }: ApiConfigFormProps) => {
  const [apiProvider, setApiProvider] = useState<string>("universal-assist");
  const [username, setUsername] = useState("raphaelbellei");
  const [password, setPassword] = useState("Anthony25");
  const [baseUrl, setBaseUrl] = useState("https://api-br.universal-assistance.com/v1");
  const [apiKey, setApiKey] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  
  const handleTestConnection = async () => {
    try {
      setTestingConnection(true);
      setTestResults(null);
      
      toast.info("Testando conexão com a API...", {
        id: "api-test",
      });
      
      // Apply temporary configuration for testing
      const tempConfig = {
        provider: apiProvider,
        baseUrl: baseUrl.replace(/\/+$/, ""),
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
      
      // General connectivity test
      const testUrl = "https://jsonplaceholder.typicode.com/todos/1";
      try {
        const testResponse = await fetch(testUrl);
        
        if (!testResponse.ok) {
          toast.error("Falha no teste de conectividade básica. Verifique sua conexão com a internet.", {
            id: "api-test",
          });
          setTestResults({
            success: false,
            source: "direct",
            error: "Falha na conectividade básica"
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
        setTestResults({
          success: false,
          source: "direct",
          error: "Problema de conectividade básica"
        });
        return;
      }
      
      // Testar conexão com a API
      const result = await testConnection();
      
      if (result.success) {
        toast.success("Conexão com a API estabelecida com sucesso!", {
          id: "api-test",
          description: "A API está acessível e as credenciais são válidas."
        });
        setTestResults({
          success: true,
          source: "direct",
          data: result.data
        });
      } else {
        toast.error("Falha na conexão com a API", {
          id: "api-test",
          description: result.message
        });
        setTestResults({
          success: false,
          source: "direct",
          error: result.message
        });
      }
      
    } catch (error) {
      console.error("Erro no teste de conexão:", error);
      toast.error("Erro ao testar conexão", { 
        id: "api-test",
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
      setTestResults({
        success: false,
        source: "test",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setTestingConnection(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Configuração baseada no provedor selecionado
      const config: any = { 
        useMock: false,
        provider: apiProvider,
        useProxy: false,
        debugMode: false,
        fallbackProxies: []
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
          
          <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
            <p className="text-xs text-amber-800 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Conexão direta com a API da Universal Assistance. As credenciais serão enviadas 
              nos headers como <strong>"Login"</strong> e <strong>"Senha"</strong>.
            </p>
          </div>
          
          <UniversalAssistanceForm 
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            baseUrl={baseUrl}
            setBaseUrl={setBaseUrl}
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

      {testResults && (
        <Alert className={`p-4 ${testResults.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="text-xs space-y-1">
              <p className="font-medium">
                {testResults.success ? 
                  "✅ Conexão bem-sucedida" : 
                  "⚠️ Problemas de conexão detectados"}
              </p>
              
              {testResults.status && (
                <p>Status HTTP: {testResults.status}</p>
              )}
              
              {testResults.error && (
                <p>Erro: {testResults.error}</p>
              )}
              
              {testResults.responseText && (
                <div>
                  <p className="font-medium mt-2">Resposta da API:</p>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
                    {testResults.responseText}
                  </pre>
                </div>
              )}
              
              {!testResults.success && (
                <div className="mt-2 pt-2 border-t border-amber-200">
                  <p className="font-medium">Sugestões:</p>
                  <ul className="list-disc pl-4 mt-1">
                    <li>Verifique se a URL base está correta</li>
                    <li>Confirme as credenciais de acesso</li>
                    <li>Certifique-se que as credenciais estão sendo enviadas como "Login" e "Senha" nos headers</li>
                  </ul>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleTestConnection}
          className="gap-1"
          disabled={testingConnection}
        >
          {testingConnection ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1"></span>
              Testando...
            </>
          ) : (
            <>
              <Bug className="w-4 h-4" />
              Testar Conexão
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.open("https://jsonplaceholder.typicode.com/todos/1", "_blank")}
          className="gap-1 text-xs"
        >
          <Globe className="w-3 h-3" />
          Testar Internet
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
