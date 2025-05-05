
import { Skeleton } from "@/components/ui/skeleton";
import { InsuranceOffer, InsuranceProvider, SearchParams } from "@/services/api/types";
import ResultsLoader from "./ResultsLoader";
import NoResultsFound from "./NoResultsFound";
import InsuranceOfferCard from "./InsuranceOfferCard";
import ResultsPagination from "./ResultsPagination";
import ResultsSorting from "./ResultsSorting";
import { AlertCircle, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SortType = "price" | "coverage";
type SortDirection = "asc" | "desc";

interface ResultsListProps {
  isLoading: boolean;
  filteredOffers: InsuranceOffer[];
  currentItems: InsuranceOffer[];
  providers: InsuranceProvider[];
  formatPrice: (price: number) => string;
  onBackToSearch: () => void;
  sortBy: SortType;
  sortDirection: SortDirection;
  handleSortChange: (type: SortType) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  searchParams?: SearchParams;
  errorMessage?: string | null;
  onRetry?: () => void;
  onConfigureApi?: () => void;
}

const ResultsList = ({
  isLoading,
  filteredOffers,
  currentItems,
  providers,
  formatPrice,
  onBackToSearch,
  sortBy,
  sortDirection,
  handleSortChange,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  searchParams,
  errorMessage,
  onRetry,
  onConfigureApi
}: ResultsListProps) => {
  return (
    <div className="md:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : errorMessage ? (
            "Erro ao carregar seguros"
          ) : (
            `${filteredOffers.length} seguros encontrados`
          )}
        </h2>
        
        {!isLoading && !errorMessage && filteredOffers.length > 0 && (
          <ResultsSorting 
            sortBy={sortBy}
            sortDirection={sortDirection}
            handleSortChange={handleSortChange}
          />
        )}
      </div>
      
      {isLoading ? (
        <ResultsLoader />
      ) : errorMessage ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao buscar seguros</AlertTitle>
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Button 
              variant="secondary" 
              onClick={onRetry} 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
            
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
              variant="ghost" 
              onClick={onBackToSearch}
            >
              Voltar à busca
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="font-semibold text-amber-800">Dicas para resolver o problema:</h3>
            <ul className="list-disc ml-5 mt-2 text-amber-700 space-y-1">
              <li>Verifique se as credenciais da API estão corretas</li>
              <li>Verifique se a URL da API está correta</li>
              <li>Confirme que os parâmetros da busca são válidos</li>
              <li>Tente ativar a opção de proxy se estiver tendo problemas de CORS</li>
            </ul>
          </div>
        </div>
      ) : filteredOffers.length === 0 ? (
        <NoResultsFound onBackToSearch={onBackToSearch} />
      ) : (
        <>
          <div className="space-y-4">
            {currentItems.map((offer) => (
              <InsuranceOfferCard 
                key={offer.id}
                offer={offer}
                providers={providers}
                formatPrice={formatPrice}
                searchParams={searchParams}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <ResultsPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ResultsList;
