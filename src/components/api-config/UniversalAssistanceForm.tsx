
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UniversalAssistanceFormProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}

const UniversalAssistanceForm = ({ 
  username, 
  setUsername, 
  password, 
  setPassword 
}: UniversalAssistanceFormProps) => {
  return (
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
  );
};

export default UniversalAssistanceForm;
