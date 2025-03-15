
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const PROXY_OPTIONS = [
  { value: "https://corsproxy.io/?", label: "corsproxy.io" },
  { value: "https://cors-proxy.htmldriven.com/?url=", label: "htmldriven.com" },
  { value: "https://cors.bridged.cc/", label: "bridged.cc" },
  { value: "https://proxy.cors.sh/", label: "cors.sh" },
];

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
          <Label htmlFor="proxySelect">Serviço de Proxy CORS</Label>
          <Select
            value={proxyUrl}
            onValueChange={setProxyUrl}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um serviço de proxy" />
            </SelectTrigger>
            <SelectContent>
              {PROXY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="mt-2">
            <Label htmlFor="customProxy">Ou informe um proxy personalizado</Label>
            <Input
              id="customProxy"
              placeholder="https://seu-proxy-personalizado.com/?"
              value={PROXY_OPTIONS.some(opt => opt.value === proxyUrl) ? "" : proxyUrl}
              onChange={(e) => {
                if (e.target.value) {
                  setProxyUrl(e.target.value);
                }
              }}
              className="mt-1"
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-1">
            Em caso de falha, o sistema tentará automaticamente os outros serviços de proxy.
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
            <li>Se o proxy atual não funcionar, selecione outro serviço de proxy</li>
            <li>Verifique se o serviço de proxy selecionado está online</li>
            <li>Se necessário, use um proxy CORS personalizado de sua confiança</li>
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
