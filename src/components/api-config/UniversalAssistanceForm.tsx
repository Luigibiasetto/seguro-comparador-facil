
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
      
      <Alert className="mt-3 border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <p className="text-xs">
            Para resolução de problemas de conexão:
          </p>
          <ul className="text-xs mt-1 list-disc pl-4">
            <li>Verifique se as credenciais estão corretas</li>
            <li>Confirme que a URL base está correta</li> 
            <li>Verifique sua conexão com a internet</li>
            <li>Se a API restringe o acesso por CORS, contate a Universal Assistance para permitir seu domínio</li>
          </ul>
          <p className="text-xs mt-2">
            O sistema tentará diversos métodos de conexão automaticamente.
          </p>
        </AlertDescription>
      </Alert>
    </>
  );
};

export default UniversalAssistanceForm;
