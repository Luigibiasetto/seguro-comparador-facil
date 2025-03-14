
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoCircledIcon } from "@radix-ui/react-icons";

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
          placeholder="https://api-br.universal-assistance.com"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          URL base para a API da Universal Assistance. Use:
          <br />• https://api-br.universal-assistance.com
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
      
      <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mt-2">
        <p className="text-xs text-amber-800 flex items-start">
          <span className="mr-1">⚠️</span>
          <span>
            Se você estiver enfrentando problemas de conexão, pode ser devido a restrições CORS da API. 
            Nesse caso, a aplicação mostrará dados de demonstração.
            Para uma integração completa, seria necessário criar um servidor intermediário ou habilitar CORS na API.
          </span>
        </p>
      </div>
    </>
  );
};

export default UniversalAssistanceForm;
