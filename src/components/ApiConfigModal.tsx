
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
            Insira os detalhes da API da Universal Assistance, incluindo o código da API, ou use dados simulados.
          </DialogDescription>
        </DialogHeader>

        <ApiConfigForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default ApiConfigModal;
