
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        <Label htmlFor="username">Credencial de Login</Label>
        <Input
          id="username"
          placeholder="Credencial de Login fornecida pela Universal Assistance"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enviado no header como <strong>"Login"</strong>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Credencial de Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Credencial de Senha fornecida pela Universal Assistance"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enviado no header como <strong>"Senha"</strong>
        </p>
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
            <li>As credenciais devem ser enviadas nos headers como <strong>"Login"</strong> e <strong>"Senha"</strong></li>
            <li>Use o botão "Testar Conexão" para verificar se a API está acessível</li>
            <li>Certifique-se que o domínio do site publicado está na lista de permissões da API</li>
          </ul>
        </AlertDescription>
      </Alert>
    </>
  );
};

export default UniversalAssistanceForm;
