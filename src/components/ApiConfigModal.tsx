
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApiConfigForm from "./api-config/ApiConfigForm";

interface ApiConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiConfigModal = ({ open, onOpenChange }: ApiConfigModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar API de Seguros</DialogTitle>
          <DialogDescription>
            Configure a URL base e as credenciais da API de seguros para buscar ofertas reais.
          </DialogDescription>
        </DialogHeader>

        <ApiConfigForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default ApiConfigModal;
