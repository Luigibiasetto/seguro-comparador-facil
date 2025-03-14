
import { useState } from "react";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { configureInsuranceAPI } from "@/services/insuranceApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiConfigModal = ({ open, onOpenChange }: ApiConfigModalProps) => {
  const [useMock, setUseMock] = useState(true);
  const [provider, setProvider] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  
  // Campos específicos da Universal Assistance
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar URL base se não estiver usando mock e não for Universal Assistance
      if (!useMock && !provider && !baseUrl) {
        toast.error("Por favor, insira uma URL base válida.");
        return;
      }
      
      // Verificar credenciais específicas para Universal Assistance
      if (provider === "universal-assist" && (!username || !password)) {
        toast.error("Por favor, insira o nome de usuário e senha para a Universal Assistance.");
        return;
      }
      
      // Se não estiver usando mock e tiver URL, validar a URL
      if (!useMock && baseUrl) {
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
        config.provider = provider;
        
        // Se tiver selecionado Universal Assistance
        if (provider === "universal-assist") {
          config.baseUrl = "https://api.universalassistance.com/v1"; // URL base da Universal Assistance
          config.providerSettings = {
            username,
            password
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar API de Seguros</DialogTitle>
          <DialogDescription>
            Insira os detalhes da API da seguradora ou use dados simulados.
          </DialogDescription>
        </DialogHeader>

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
              <div className="space-y-2">
                <Label htmlFor="provider">Provedor de API</Label>
                <Select
                  value={provider}
                  onValueChange={setProvider}
                >
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Selecione o provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">API Personalizada</SelectItem>
                    <SelectItem value="universal-assist">Universal Assistance</SelectItem>
                    {/* Adicione outros provedores conforme necessário */}
                  </SelectContent>
                </Select>
              </div>

              {provider === "universal-assist" ? (
                // Campos específicos para Universal Assistance
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de usuário</Label>
                    <Input
                      id="username"
                      placeholder="Usuário da API"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Senha da API"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              ) : (
                // Campos para API genérica
                <>
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">URL Base da API</Label>
                    <Input
                      id="baseUrl"
                      placeholder="https://api.seguradora.com"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      required={provider === ""}
                      disabled={provider !== ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">Chave da API (opcional)</Label>
                    <Input
                      id="apiKey"
                      placeholder="sua-chave-api"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={provider !== ""}
                    />
                  </div>
                </>
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
      </DialogContent>
    </Dialog>
  );
};

export default ApiConfigModal;
