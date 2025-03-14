
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UniversalAssistanceFormProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  apiCode: string;
  setApiCode: (value: string) => void;
  baseUrl: string;
  setBaseUrl: (value: string) => void;
}

const UniversalAssistanceForm = ({ 
  username, 
  setUsername, 
  password, 
  setPassword,
  apiCode,
  setApiCode,
  baseUrl,
  setBaseUrl
}: UniversalAssistanceFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="baseUrl">URL Base da API</Label>
        <Input
          id="baseUrl"
          placeholder="https://api.universalassistance.com/v1"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          URL base para a API da Universal Assistance (ex: https://api.universalassistance.com/v1)
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

      <div className="space-y-2">
        <Label htmlFor="apiCode">Código da API</Label>
        <Input
          id="apiCode"
          placeholder="Código da API Universal Assistance"
          value={apiCode}
          onChange={(e) => setApiCode(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          O código da API é fornecido pela Universal Assistance e é necessário para autenticação.
        </p>
      </div>
    </>
  );
};

export default UniversalAssistanceForm;
