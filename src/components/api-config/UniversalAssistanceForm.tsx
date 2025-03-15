
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface UniversalAssistanceFormProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  baseUrl: string;
  setBaseUrl: (value: string) => void;
  useProxy: boolean;
  setUseProxy: (value: boolean) => void;
  proxyUrl: string;
  setProxyUrl: (value: string) => void;
}

const UniversalAssistanceForm = ({ 
  username, 
  setUsername, 
  password, 
  setPassword,
  baseUrl,
  setBaseUrl,
  useProxy,
  setUseProxy,
  proxyUrl,
  setProxyUrl
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

      <div className="flex items-center space-x-2 mt-4">
        <Switch 
          id="useProxy" 
          checked={useProxy}
          onCheckedChange={setUseProxy}
        />
        <Label htmlFor="useProxy">Usar Proxy CORS</Label>
      </div>
      
      {useProxy && (
        <div className="space-y-2 mt-2">
          <Label htmlFor="proxyUrl">URL do Proxy CORS</Label>
          <Input
            id="proxyUrl"
            placeholder="https://corsproxy.io/?"
            value={proxyUrl}
            onChange={(e) => setProxyUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Recomendados:
            <br />• https://corsproxy.io/?
            <br />• https://cors.bridged.cc/
            <br />• https://proxy.cors.sh/
          </p>
        </div>
      )}
      
      <Alert className="mt-3 border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <p className="text-xs">
            Para resolução de problemas de conexão:
          </p>
          <ul className="text-xs mt-1 list-disc pl-4">
            <li>Verifique se as credenciais estão corretas</li>
            <li>Confirme que a URL base está correta</li> 
            <li>Ative a opção "Usar Proxy CORS" para resolver problemas de CORS</li>
            <li>Se houver problemas, tente um proxy CORS alternativo</li>
            <li>Verifique sua conexão com a internet</li>
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
