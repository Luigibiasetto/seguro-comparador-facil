
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GenericApiFormProps {
  baseUrl: string;
  setBaseUrl: (value: string) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
  disabled: boolean;
}

const GenericApiForm = ({ 
  baseUrl, 
  setBaseUrl, 
  apiKey, 
  setApiKey,
  disabled
}: GenericApiFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="baseUrl">URL Base da API</Label>
        <Input
          id="baseUrl"
          placeholder="https://api.seguradora.com"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          required={!disabled}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">Chave da API (opcional)</Label>
        <Input
          id="apiKey"
          placeholder="sua-chave-api"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default GenericApiForm;
