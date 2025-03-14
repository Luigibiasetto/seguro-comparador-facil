
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { configureInsuranceAPI } from "@/services/insuranceApi";
import ProviderSelect from "./ProviderSelect";
import UniversalAssistanceForm from "./UniversalAssistanceForm";
import GenericApiForm from "./GenericApiForm";

interface ApiConfigFormProps {
  onOpenChange: (open: boolean) => void;
}

const ApiConfigForm = ({ onOpenChange }: ApiConfigFormProps) => {
  const [useMock, setUseMock] = useState(true);
  const [provider, setProvider] = useState("custom");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  
  // Campos específicos da Universal Assistance
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiCode, setApiCode] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar URL base se não estiver usando mock e for API personalizada
      if (!useMock && provider === "custom" && !baseUrl) {
        toast.error("Por favor, insira uma URL base válida.");
        return;
      }
      
      // Verificar credenciais específicas para Universal Assistance
      if (provider === "universal-assist" && (!username || !password || !apiCode)) {
        toast.error("Por favor, preencha todos os campos da Universal Assistance (usuário, senha e código da API).");
        return;
      }
      
      // Se não estiver usando mock e tiver URL, validar a URL
      if (!useMock && provider === "custom" && baseUrl) {
        try {
          new URL(baseUrl);
        } catch (error) {
          toast.error("Por favor, insira uma URL base válida.");
          return;
        }
      }
      
      // Configurar a API
      const config: any = { useMock };
      
      if (!useMock) {
        config.provider = provider === "custom" ? "" : provider;
        
        // Se tiver selecionado Universal Assistance
        if (provider === "universal-assist") {
          config.baseUrl = "https://api.universalassistance.com/v1"; // URL base da Universal Assistance
          config.providerSettings = {
            username,
            password,
            apiCode,
          };
        } else {
          // Para outras APIs genéricas
          config.baseUrl = baseUrl;
          if (apiKey) config.apiKey = apiKey;
        }
      }
      
      configureInsuranceAPI(config);
      
      const successMessage = useMock 
        ? "Configurado para usar dados simulados." 
        : provider === "universal-assist"
          ? "API da Universal Assistance configurada com sucesso!"
          : "API configurada com sucesso!";
          
      toast.success(successMessage);
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao configurar API:", error);
      toast.error("Ocorreu um erro ao configurar a API.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="use-mock" 
          checked={useMock} 
          onCheckedChange={setUseMock} 
        />
        <Label htmlFor="use-mock">
          Usar dados simulados
        </Label>
      </div>

      {!useMock && (
        <>
          <ProviderSelect value={provider} onValueChange={setProvider} />

          {provider === "universal-assist" ? (
            <UniversalAssistanceForm 
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              apiCode={apiCode}
              setApiCode={setApiCode}
            />
          ) : (
            <GenericApiForm
              baseUrl={baseUrl}
              setBaseUrl={setBaseUrl}
              apiKey={apiKey}
              setApiKey={setApiKey}
              disabled={provider !== "custom"}
            />
          )}
        </>
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
