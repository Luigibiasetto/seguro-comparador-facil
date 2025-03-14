
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { configureInsuranceAPI } from "@/services/insuranceApi";
import UniversalAssistanceForm from "./UniversalAssistanceForm";

interface ApiConfigFormProps {
  onOpenChange: (open: boolean) => void;
}

const ApiConfigForm = ({ onOpenChange }: ApiConfigFormProps) => {
  const [useMock, setUseMock] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiCode, setApiCode] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Verificar credenciais específicas para Universal Assistance se não estiver usando mock
      if (!useMock && (!username || !password || !apiCode)) {
        toast.error("Por favor, preencha todos os campos da Universal Assistance (usuário, senha e código da API).");
        return;
      }
      
      // Configurar a API
      const config: any = { useMock };
      
      if (!useMock) {
        config.provider = "universal-assist";
        config.baseUrl = "https://api.universalassistance.com/v1"; // URL base da Universal Assistance
        config.providerSettings = {
          username,
          password,
          apiCode,
        };
      }
      
      configureInsuranceAPI(config);
      
      const successMessage = useMock 
        ? "Configurado para usar dados simulados." 
        : "API da Universal Assistance configurada com sucesso!";
          
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
        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-sm font-medium mb-3">Universal Assistance API</h3>
          <UniversalAssistanceForm 
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            apiCode={apiCode}
            setApiCode={setApiCode}
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
