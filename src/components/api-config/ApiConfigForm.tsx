
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Check, Bug, Database, AlertTriangle, Globe } from "lucide-react";
import { toast } from "sonner";
import { configureInsuranceAPI, getApiConfig } from "@/services/api/config";
import UniversalAssistanceForm from "./UniversalAssistanceForm";
import ProviderSelect from "./ProviderSelect";
import GenericApiForm from "./GenericApiForm";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [useSupabase, setUseSupabase] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  
  const testConnection = async () => {
    try {
      setTestingConnection(true);
      setTestResults(null);
      
      toast.info("Testando conexão com a API...", {
        id: "api-test",
      });
      
      if (useSupabase && apiProvider === "universal-assist") {
        try {
          toast.info("Testando conexão via Supabase Edge Function...", {
            id: "api-test",
          });
          
          const { data, error } = await supabase.functions.invoke('universal-assist/test');
          
          if (error) {
            console.error("Erro ao chamar Edge Function:", error);
            toast.error("Falha ao testar via Supabase", {
              id: "api-test",
              description: error.message
            });
            setTestResults({
              success: false,
              source: "supabase",
              error: error.message
            });
          } else if (data && data.success) {
            toast.success("Conexão via Supabase bem-sucedida!", {
              id: "api-test",
              description: data.details || "Autenticação realizada com sucesso"
            });
            setTestResults({
              success: true,
              source: "supabase",
              details: data
            });
            return;
          } else {
            toast.error("Falha na conexão via Supabase", {
              id: "api-test",
              description: data?.details || "Erro desconhecido"
            });
            setTestResults({
              success: false,
              source: "supabase",
              details: data
            });
          }
        } catch (edgeFunctionError) {
          console.error("Erro ao invocar Edge Function:", edgeFunctionError);
          toast.error("Erro ao chamar Edge Function", {
            id: "api-test",
            description: "Verifique se a função está implantada corretamente"
          });
          setTestResults({
            success: false,
            source: "supabase",
            error: edgeFunctionError instanceof Error ? edgeFunctionError.message : "Erro desconhecido"
          });
        }
      }
      
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
          setTestResults({
            success: true,
            source: "direct",
            status: status
          });
        } else {
          toast.warning(`API respondeu com status: ${status}`, {
            id: "api-test",
            description: "A API foi contactada, mas retornou um status inesperado."
          });
          setTestResults({
            success: false,
            source: "direct",
            status: status
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
          
          setTestResults(prev => ({
            ...prev,
            responseText: responseText.substring(0, 500)
          }));
        } catch (textError) {
          console.error("Erro ao obter texto da resposta:", textError);
          setTestResults(prev => ({
            ...prev,
            textError: textError instanceof Error ? textError.message : "Erro ao ler resposta"
          }));
        }
        
      } catch (apiError) {
        console.error("Erro ao conectar com a API:", apiError);
        
        if (useProxy) {
          toast.error("Falha ao conectar usando o proxy atual", {
            id: "api-test",
            description: "Tente outro serviço de proxy ou desative o proxy se a API permitir acesso direto."
          });
          
          setTestResults({
            success: false,
            source: "direct",
            error: apiError instanceof Error ? apiError.message : "Erro ao conectar com proxy"
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
              setTestResults(prev => ({
                ...prev,
                directSuccess: true,
                directStatus: directResponse.status
              }));
            }
          } catch (directError) {
            toast.error("Também falhou sem proxy. Possível problema de CORS ou API indisponível.", {
              duration: 8000
            });
            setTestResults(prev => ({
              ...prev,
              directError: directError instanceof Error ? directError.message : "Erro de acesso direto"
            }));
          }
        } else {
          toast.error("Falha na conexão direta com a API", {
            id: "api-test",
            description: "Tente ativar o proxy CORS para resolver possíveis problemas de CORS."
          });
          setTestResults({
            success: false,
            source: "direct",
            error: apiError instanceof Error ? apiError.message : "Erro de conexão direta"
          });
        }
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
        useProxy,
        proxyUrl: useProxy ? proxyUrl : undefined,
        debugMode,
        useSupabase,
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
          
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="useSupabase"
              checked={useSupabase}
              onChange={(e) => setUseSupabase(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="useSupabase" className="text-sm font-medium text-gray-700 flex items-center">
              <Database className="h-4 w-4 mr-1" />
              Usar Supabase Edge Function (recomendado)
            </label>
          </div>
          
          {useSupabase && (
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
              <p className="text-xs text-green-800">
                A função Supabase Edge Function está ativada. Isso contornará os problemas de CORS 
                e realizará a autenticação de forma segura pelo servidor.
              </p>
            </div>
          )}
          
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
              
              {testResults.source && (
                <p>
                  Método: {testResults.source === "supabase" ? 
                    "Supabase Edge Function" : 
                    "Conexão direta/proxy"}
                </p>
              )}
              
              {testResults.status && (
                <p>Status HTTP: {testResults.status}</p>
              )}
              
              {testResults.error && (
                <p>Erro: {testResults.error}</p>
              )}
              
              {testResults.details && testResults.details.details && (
                <p>Detalhes: {testResults.details.details}</p>
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
                    {!useSupabase && (
                      <li>Ative a opção "Usar Supabase Edge Function"</li>
                    )}
                    {useSupabase && testResults.source === "supabase" && (
                      <li>Desative a opção "Usar Supabase Edge Function" e tente com proxy CORS</li>
                    )}
                    {!useProxy && (
                      <li>Ative a opção "Usar Proxy CORS"</li>
                    )}
                    {useProxy && (
                      <li>Tente outro serviço de proxy CORS</li>
                    )}
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
          onClick={testConnection}
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
