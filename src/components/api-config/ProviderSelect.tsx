
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProviderSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ProviderSelect = ({ value, onValueChange }: ProviderSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="provider">Provedor de API</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger id="provider">
          <SelectValue placeholder="Selecione o provedor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="universal-assist">Universal Assistance</SelectItem>
          <SelectItem value="custom">API Personalizada</SelectItem>
          {/* Adicione outros provedores conforme necessário */}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        Selecione o provedor de API de seguros que você deseja configurar.
      </p>
    </div>
  );
};

export default ProviderSelect;
