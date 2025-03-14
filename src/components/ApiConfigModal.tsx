
import { useState } from "react";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { configureInsuranceAPI } from "@/services/insuranceApi";

interface ApiConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiConfigModal = ({ open, onOpenChange }: ApiConfigModalProps) => {
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [useMock, setUseMock] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar URL base se não estiver usando mock
      if (!useMock) {
        if (!baseUrl) {
          toast.error("Por favor, insira uma URL base válida.");
          return;
        }
        
        // Tentar criar um objeto URL para verificar se é uma URL válida
        try {
          new URL(baseUrl);
        } catch (error) {
          toast.error("Por favor, insira uma URL base válida.");
          return;
        }
      }
      
      // Configurar a API
      configureInsuranceAPI({
        baseUrl,
        apiKey: apiKey || undefined,
        useMock,
      });
      
      toast.success(
        useMock 
          ? "Configurado para usar dados simulados." 
          : "API configurada com sucesso!"
      );
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao configurar API:", error);
      toast.error("Ocorreu um erro ao configurar a API.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar API de Seguros</DialogTitle>
          <DialogDescription>
            Insira os detalhes da API da seguradora ou use dados simulados.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="use-mock" 
              checked={useMock} 
              onCheckedChange={setUseMock} 
            />
            <Label htmlFor="use-mock">
              Usar dados simulados
            </Label>
          </div>

          {!useMock && (
            <>
              <div className="space-y-2">
                <Label htmlFor="baseUrl">URL Base da API</Label>
                <Input
                  id="baseUrl"
                  placeholder="https://api.seguradora.com"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  disabled={useMock}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">Chave da API (opcional)</Label>
                <Input
                  id="apiKey"
                  placeholder="sua-chave-api"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={useMock}
                />
              </div>
            </>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">
              <Check className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiConfigModal;
