
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
          <SelectItem value="">API Personalizada</SelectItem>
          <SelectItem value="universal-assist">Universal Assistance</SelectItem>
          {/* Adicione outros provedores conforme necessário */}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProviderSelect;
