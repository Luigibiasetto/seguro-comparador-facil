
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Check } from "lucide-react";
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
  const [username, setUsername] = useState("luigi.biasetto");
  const [password, setPassword] = useState("tIMES18");
  const [baseUrl, setBaseUrl] = useState("https://api.universal-assistance.com");
  const [apiKey, setApiKey] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Configuração baseada no provedor selecionado
      const config: any = { 
        useMock: false,
        provider: apiProvider
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
