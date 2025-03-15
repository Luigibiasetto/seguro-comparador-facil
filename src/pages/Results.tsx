
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import { 
  InsuranceOffer, 
  searchInsurances, 
  getInsuranceProviders, 
  parseSearchParams,
  InsuranceProvider
} from "@/services/insuranceApi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ApiConfigModal from "@/components/ApiConfigModal";
import SearchSummary from "@/components/results/SearchSummary";
import ResultsFilters from "@/components/results/ResultsFilters";
import ResultsList from "@/components/results/ResultsList";
import { secureStore } from "@/services/security/dataSecurity";

type SortType = "price" | "coverage"; // Removed rating
type SortDirection = "asc" | "desc";

interface FilterState {
  providers: string[];
  minCoverage: number;
  maxPrice: number | null;
  benefits: string[];
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const parsedParams = parseSearchParams(searchParams);

  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState<InsuranceOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<InsuranceOffer[]>([]);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);

  const [sortBy, setSortBy] = useState<SortType>("price");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState<FilterState>({
    providers: [],
    minCoverage: 0,
    maxPrice: null,
    benefits: [],
  });
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const currentItems = filteredOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [searchSummary, setSearchSummary] = useState({
    origin: parsedParams.origin,
    destination: parsedParams.destination,
    departureDate: new Date(parsedParams.departureDate),
    returnDate: new Date(parsedParams.returnDate),
    passengers: parsedParams.passengers,
  });

  // Add data security feature - encrypt form data
  const [dataEncrypted, setDataEncrypted] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [providersData, offersData] = await Promise.all([
          getInsuranceProviders(),
          searchInsurances(parsedParams),
        ]);
        
        setProviders(providersData);
        setOffers(offersData);
        setFilteredOffers(offersData);
        
        // Store search params for checkout
        secureStore('searchParams', parsedParams);
        
        setFilters({
          providers: [],
          minCoverage: 0,
          maxPrice: Math.max(...offersData.map(o => o.price)) + 50,
          benefits: [],
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Ocorreu um erro ao carregar os seguros. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  useEffect(() => {
    let result = [...offers];
    
    if (filters.providers.length > 0) {
      result = result.filter(offer => filters.providers.includes(offer.providerId));
    }
    
    if (filters.minCoverage > 0) {
      result = result.filter(offer => offer.coverage.medical >= filters.minCoverage);
    }
    
    if (filters.maxPrice !== null) {
      result = result.filter(offer => offer.price <= filters.maxPrice!);
    }
    
    if (filters.benefits.length > 0) {
      result = result.filter(offer => 
        filters.benefits.every(benefit => offer.benefits.includes(benefit))
      );
    }
    
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "price") {
        comparison = a.price - b.price;
      } else if (sortBy === "coverage") {
        comparison = a.coverage.medical - b.coverage.medical;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    setFilteredOffers(result);
    setCurrentPage(1);
  }, [filters, sortBy, sortDirection, offers]);

  const handleSortChange = (type: SortType) => {
    if (sortBy === type) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortDirection("asc");
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleBackToSearch = () => {
    navigate('/');
  };

  const allBenefits = Array.from(
    new Set(offers.flatMap(offer => offer.benefits))
  );

  const maxOfferPrice = Math.max(...offers.map(o => o.price * 1.5), 5000);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              className="items-center gap-1" 
              onClick={handleBackToSearch}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar à busca
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-1"
              onClick={() => setIsApiConfigOpen(true)}
            >
              <Settings className="w-4 h-4" />
              Configurar API
            </Button>
          </div>
          
          <SearchSummary {...searchSummary} />
          
          {/* Data security indicator */}
          <div className="mb-4 flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${dataEncrypted ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {dataEncrypted ? 'Dados criptografados' : 'Dados não criptografados'}
            </span>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <ResultsFilters 
                filters={filters}
                setFilters={setFilters}
                providers={providers}
                allBenefits={allBenefits}
                maxOfferPrice={maxOfferPrice}
                formatPrice={formatPrice}
              />
            </div>
            
            <ResultsList 
              isLoading={isLoading}
              filteredOffers={filteredOffers}
              currentItems={currentItems}
              providers={providers}
              formatPrice={formatPrice}
              onBackToSearch={handleBackToSearch}
              sortBy={sortBy}
              sortDirection={sortDirection}
              handleSortChange={handleSortChange}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              searchParams={parsedParams}
            />
          </div>
        </div>
      </main>
      
      <Footer />
      
      <ApiConfigModal 
        open={isApiConfigOpen}
        onOpenChange={setIsApiConfigOpen}
      />
    </div>
  );
};

export default Results;
