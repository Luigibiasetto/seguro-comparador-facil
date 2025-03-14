import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Filter, ArrowLeft, Star, ChevronDown, ChevronUp, Check,
  ArrowUpDown, Loader2, Info, MoreHorizontal, Settings
} from "lucide-react";
import { 
  InsuranceOffer, 
  searchInsurances, 
  getInsuranceProviders, 
  parseSearchParams,
  InsuranceProvider,
  configureInsuranceAPI 
} from "@/services/insuranceApi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter,
  CardDescription 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatCountry } from "@/lib/countries";
import { toast } from "sonner";
import ApiConfigModal from "@/components/ApiConfigModal";

const PaginationEllipsis = () => {
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">Mais páginas</span>
    </div>
  );
};

type SortType = "price" | "coverage" | "rating";
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

  const [expandedOffers, setExpandedOffers] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<SortType>("price");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState<FilterState>({
    providers: [],
    minCoverage: 0,
    maxPrice: null,
    benefits: [],
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchSummary, setSearchSummary] = useState({
    origin: parsedParams.origin,
    destination: parsedParams.destination,
    departureDate: new Date(parsedParams.departureDate),
    returnDate: new Date(parsedParams.returnDate),
    passengers: parsedParams.passengers,
  });
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const currentItems = filteredOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      } else if (sortBy === "rating") {
        comparison = a.rating - b.rating;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    setFilteredOffers(result);
    setCurrentPage(1);
  }, [filters, sortBy, sortDirection, offers]);

  const toggleExpand = (offerId: string) => {
    setExpandedOffers(prev => ({
      ...prev,
      [offerId]: !prev[offerId]
    }));
  };

  const handleProviderFilterChange = (providerId: string) => {
    setFilters(prev => {
      const isSelected = prev.providers.includes(providerId);
      return {
        ...prev,
        providers: isSelected
          ? prev.providers.filter(id => id !== providerId)
          : [...prev.providers, providerId]
      };
    });
  };

  const handleBenefitFilterChange = (benefit: string) => {
    setFilters(prev => {
      const isSelected = prev.benefits.includes(benefit);
      return {
        ...prev,
        benefits: isSelected
          ? prev.benefits.filter(b => b !== benefit)
          : [...prev.benefits, benefit]
      };
    });
  };

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

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 text-yellow-400" />
        )}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const allBenefits = Array.from(
    new Set(offers.flatMap(offer => offer.benefits))
  );

  const handleBackToSearch = () => {
    navigate('/');
  };

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
          
          <div className="p-4 bg-muted rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Resumo da busca</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Origem</div>
                <div className="font-medium">{formatCountry(searchSummary.origin)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Destino</div>
                <div className="font-medium">{formatCountry(searchSummary.destination)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Data de ida</div>
                <div className="font-medium">
                  {format(searchSummary.departureDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Data de volta</div>
                <div className="font-medium">
                  {format(searchSummary.returnDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Passageiros</div>
                <div className="font-medium">{searchSummary.passengers}</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="w-4 h-4" /> 
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Seguradoras</h3>
                    {providers.map((provider) => (
                      <div key={provider.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`provider-${provider.id}`} 
                          checked={filters.providers.includes(provider.id)}
                          onCheckedChange={() => handleProviderFilterChange(provider.id)}
                        />
                        <label 
                          htmlFor={`provider-${provider.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {provider.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Cobertura médica mínima</h3>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="minCoverage">
                          {formatPrice(filters.minCoverage)}
                        </label>
                        <Input
                          type="range"
                          min="0"
                          max="1000000"
                          step="10000"
                          id="minCoverage"
                          value={filters.minCoverage}
                          onChange={(e) => setFilters(prev => ({ ...prev, minCoverage: parseInt(e.target.value) }))}
                          className="col-span-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Preço máximo</h3>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="maxPrice">
                          {filters.maxPrice ? formatPrice(filters.maxPrice) : "Sem limite"}
                        </label>
                        <Input
                          type="range"
                          min="0"
                          max={Math.max(...offers.map(o => o.price * 1.5), 5000)}
                          step="50"
                          id="maxPrice"
                          value={filters.maxPrice || 0}
                          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                          className="col-span-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Benefícios</h3>
                    {allBenefits.map((benefit) => (
                      <div key={benefit} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`benefit-${benefit}`} 
                          checked={filters.benefits.includes(benefit)}
                          onCheckedChange={() => handleBenefitFilterChange(benefit)}
                        />
                        <label 
                          htmlFor={`benefit-${benefit}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {benefit}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {isLoading ? (
                    <Skeleton className="h-8 w-64" />
                  ) : (
                    `${filteredOffers.length} seguros encontrados`
                  )}
                </h2>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Ordenar por:</span>
                  <div className="flex gap-1">
                    <Button 
                      variant={sortBy === "price" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSortChange("price")}
                      className="text-xs h-8"
                    >
                      Preço {sortBy === "price" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                    <Button 
                      variant={sortBy === "coverage" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSortChange("coverage")}
                      className="text-xs h-8"
                    >
                      Cobertura {sortBy === "coverage" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                    <Button 
                      variant={sortBy === "rating" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSortChange("rating")}
                      className="text-xs h-8"
                    >
                      Avaliação {sortBy === "rating" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex flex-col space-y-3">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex justify-between pt-2">
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredOffers.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium mb-2">Nenhum seguro encontrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Não encontramos resultados com os filtros atuais. Tente ajustar os filtros ou fazer uma nova busca.
                    </p>
                    <Button onClick={handleBackToSearch}>Nova busca</Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="space-y-4">
                    {currentItems.map((offer) => (
                      <Card key={offer.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-bold">
                                    {providers.find(p => p.id === offer.providerId)?.name || "Seguradora"}
                                  </h3>
                                  {renderRating(offer.rating)}
                                </div>
                                <div className="text-muted-foreground text-sm mb-2">
                                  {offer.name}
                                </div>
                                <div className="flex flex-wrap gap-2 my-2">
                                  {offer.benefits.slice(0, 3).map(benefit => (
                                    <div key={benefit} className="bg-muted px-2 py-1 rounded-md text-xs flex items-center">
                                      <Check className="w-3 h-3 mr-1" />
                                      {benefit}
                                    </div>
                                  ))}
                                  {offer.benefits.length > 3 && (
                                    <div className="bg-muted px-2 py-1 rounded-md text-xs">
                                      +{offer.benefits.length - 3} benefícios
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="text-2xl font-bold text-primary">
                                  {formatPrice(offer.price)}
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  Cobertura médica: {formatPrice(offer.coverage.medical)}
                                </div>
                                <Button>Contratar</Button>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs"
                                onClick={() => toggleExpand(offer.id)}
                              >
                                {expandedOffers[offer.id] ? (
                                  <>Mostrar menos <ChevronUp className="ml-1 h-3 w-3" /></>
                                ) : (
                                  <>Ver detalhes <ChevronDown className="ml-1 h-3 w-3" /></>
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          {expandedOffers[offer.id] && (
                            <div className="border-t p-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3">Coberturas</h4>
                                  <Table>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell>Médica</TableCell>
                                        <TableCell className="text-right">{formatPrice(offer.coverage.medical)}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>Odontológica</TableCell>
                                        <TableCell className="text-right">{formatPrice(offer.coverage.dental)}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>Farmacêutica</TableCell>
                                        <TableCell className="text-right">{formatPrice(offer.coverage.pharmaceutical)}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>Bagagem</TableCell>
                                        <TableCell className="text-right">{formatPrice(offer.coverage.baggage)}</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-3">Benefícios</h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {offer.benefits.map(benefit => (
                                      <div key={benefit} className="flex items-center gap-2">
                                        <Check className="text-primary w-4 h-4" />
                                        <span>{benefit}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {filteredOffers.length > itemsPerPage && (
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNumber = index + 1;
                            
                            // Mostra apenas páginas próximas à atual e primeira/última
                            if (
                              pageNumber === 1 ||
                              pageNumber === totalPages ||
                              Math.abs(pageNumber - currentPage) <= 1
                            ) {
                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(pageNumber);
                                    }}
                                    isActive={pageNumber === currentPage}
                                  >
                                    {pageNumber}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            } else if (
                              (pageNumber === 2 && currentPage > 3) ||
                              (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                            ) {
                              return <PaginationItem key={pageNumber}><PaginationEllipsis /></PaginationItem>;
                            }
                            
                            return null;
                          })}
                          
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                              }}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
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
