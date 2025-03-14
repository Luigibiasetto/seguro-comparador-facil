
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UniversalAssistanceFormProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  baseUrl: string;
  setBaseUrl: (value: string) => void;
}

const UniversalAssistanceForm = ({ 
  username, 
  setUsername, 
  password, 
  setPassword,
  baseUrl,
  setBaseUrl
}: UniversalAssistanceFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="baseUrl">URL Base da API</Label>
        <Input
          id="baseUrl"
          placeholder="https://api-br.universal-assistance.com/v1"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          URL base para a API da Universal Assistance. Use:
          <br />• https://api-br.universal-assistance.com/v1
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Nome de usuário</Label>
        <Input
          id="username"
          placeholder="Usuário fornecido pela Universal Assistance"
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
          placeholder="Senha fornecida pela Universal Assistance"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Alert variant="warning" className="mt-3">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <p className="text-xs">
            As APIs da Universal Assistance podem não permitir acesso direto do navegador por restrições de CORS.
            Se encontrar problemas de conexão, a aplicação mostrará dados de demonstração.
          </p>
          <p className="text-xs mt-2">
            Para uma integração completa, você precisaria implementar um servidor intermediário (proxy).
          </p>
        </AlertDescription>
      </Alert>
    </>
  );
};

export default UniversalAssistanceForm;
