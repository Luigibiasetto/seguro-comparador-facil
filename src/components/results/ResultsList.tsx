
import { Skeleton } from "@/components/ui/skeleton";
import { InsuranceOffer, InsuranceProvider } from "@/services/insuranceApi";
import ResultsLoader from "./ResultsLoader";
import NoResultsFound from "./NoResultsFound";
import InsuranceOfferCard from "./InsuranceOfferCard";
import ResultsPagination from "./ResultsPagination";
import ResultsSorting from "./ResultsSorting";

type SortType = "price" | "coverage" | "rating";
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
  itemsPerPage
}: ResultsListProps) => {
  return (
    <div className="md:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            `${filteredOffers.length} seguros encontrados`
          )}
        </h2>
        
        <ResultsSorting 
          sortBy={sortBy}
          sortDirection={sortDirection}
          handleSortChange={handleSortChange}
        />
      </div>
      
      {isLoading ? (
        <ResultsLoader />
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
              />
            ))}
          </div>
          
          <ResultsPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default ResultsList;
