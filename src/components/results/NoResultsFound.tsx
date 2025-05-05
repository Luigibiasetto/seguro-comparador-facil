
import { ArrowLeft, RefreshCw, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NoResultsFoundProps {
  onBackToSearch: () => void;
  onRetry?: () => void;
  onConfigureApi?: () => void;
  errorMessage?: string;
}

const NoResultsFound = ({
  onBackToSearch,
  onRetry,
  onConfigureApi,
  errorMessage
}: NoResultsFoundProps) => {
  const isFolhetoError = errorMessage?.includes("folheto") || 
                         errorMessage?.includes("Nenhum produto disponível") || 
                         errorMessage?.includes("esta combinação");

  return (
    <div className="text-center py-10 space-y-6">
      <div className="flex justify-center">
        <div className="bg-gray-100 p-4 rounded-full">
          <Search className="h-10 w-10 text-gray-500" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Nenhum seguro encontrado</h3>
        
        {errorMessage && (
          <Alert variant={isFolhetoError ? "default" : "destructive"} className={`text-left mb-4 ${isFolhetoError ? 'border-amber-300 bg-amber-50' : ''}`}>
            <AlertTitle>{isFolhetoError ? "Combinação não disponível" : "Erro na busca"}</AlertTitle>
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <p className="text-gray-600">
          {isFolhetoError 
            ? "A Universal Assistance não possui produtos disponíveis para esta combinação de datas e destino."
            : "Não encontramos seguros com os parâmetros informados."}
        </p>
      </div>
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
        {onRetry && (
          <Button 
            variant="secondary" 
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        )}
        
        {onConfigureApi && (
          <Button 
            variant="outline" 
            onClick={onConfigureApi}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurar API
          </Button>
        )}
        
        <Button 
          variant="default" 
          onClick={onBackToSearch}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Modificar busca
        </Button>
      </div>
      
      {isFolhetoError && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-left">
          <h4 className="font-semibold text-amber-800 mb-2">Sugestões:</h4>
          <ul className="list-disc ml-5 text-amber-700 space-y-1">
            <li>Tente datas diferentes (períodos mais longos geralmente têm mais opções)</li>
            <li>Altere o destino para outra região ou continente</li>
            <li>Verifique se as datas de ida e volta não são iguais</li>
            <li>Certifique-se de que a data de viagem está no futuro</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NoResultsFound;
