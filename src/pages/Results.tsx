import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Filter, ArrowLeft, Star, ChevronDown, ChevronUp, Check,
  ArrowUpDown, Loader2, Info, MoreHorizontal
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

// Componente PaginationEllipsis que estava faltando
const PaginationEllipsis = () => {
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">Mais páginas</span>
    </div>
  );
};

// Definição de tipos para os filtros e ordenação
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

  // Estados para os dados
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState<InsuranceOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<InsuranceOffer[]>([]);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);

  // Estados para a interface
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

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const currentItems = filteredOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Carregar dados
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Carregar provedores e ofertas de seguro
        const [providersData, offersData] = await Promise.all([
          getInsuranceProviders(),
          searchInsurances(parsedParams),
        ]);
        
        setProviders(providersData);
        setOffers(offersData);
        setFilteredOffers(offersData);
        
        // Inicializar estados relacionados
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

  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = [...offers];
    
    // Aplicar filtros
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
    
    // Aplicar ordenação
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
    setCurrentPage(1); // Resetar para a primeira página ao mudar filtros
  }, [filters, sortBy, sortDirection, offers]);

  // Alternar a expansão de uma oferta
  const toggleExpand = (offerId: string) => {
    setExpandedOffers(prev => ({
      ...prev,
      [offerId]: !prev[offerId]
    }));
  };

  // Manipular alterações de filtro de provedor
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

  // Manipular alterações de filtro de benefício
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

  // Alternar direção de ordenação
  const handleSortChange = (type: SortType) => {
    if (sortBy === type) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortDirection("asc");
    }
  };

  // Formatar preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Renderizar estrelas de avaliação
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

  // Extrair todos os benefícios únicos
  const allBenefits = Array.from(
    new Set(offers.flatMap(offer => offer.benefits))
  );

  // Função para voltar à página de busca
  const handleBackToSearch = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Resumo da busca e navegação de volta */}
          <div className="mb-6 flex justify-between items-start">
            <Button
              variant="ghost"
              className="mb-4 pl-0 text-gray-600"
              onClick={handleBackToSearch}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar à busca
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsApiConfigOpen(true)}
              className="text-gray-600"
            >
              Configurar API
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Resumo da busca</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Destino</p>
                <p className="font-medium">{formatCountry(searchSummary.destination)}</p>
              </div>
              <div>
                <p className="text-gray-500">Período</p>
                <p className="font-medium">
                  {format(searchSummary.departureDate, "dd/MM/yyyy", { locale: ptBR })} a{" "}
                  {format(searchSummary.returnDate, "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Passageiros</p>
                <p className="font-medium">
                  {searchSummary.passengers.count} {searchSummary.passengers.count === 1 ? "passageiro" : "passageiros"}{" "}
                  ({searchSummary.passengers.ages.map(age => `${age} anos`).join(", ")})
                </p>
              </div>
            </div>
          </div>

          {/* Container principal */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filtros em desktop */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Filtros</h2>
                
                {/* Filtro de preço */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Preço máximo</h3>
                  <div className="mb-2">
                    <Input
                      type="range"
                      min="0"
                      max={(Math.max(...offers.map(o => o.price)) + 100).toString()}
                      step="50"
                      value={filters.maxPrice?.toString() || "0"}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm font-medium text-brand-600">
                    {formatPrice(filters.maxPrice || 0)}
                  </div>
                </div>
                
                {/* Filtro de cobertura médica */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Cobertura Médica Mínima</h3>
                  <div className="space-y-2">
                    {[30000, 60000, 100000].map((coverage) => (
                      <div key={coverage} className="flex items-center">
                        <Checkbox
                          id={`coverage-${coverage}`}
                          checked={filters.minCoverage === coverage}
                          onCheckedChange={() => setFilters(prev => ({ 
                            ...prev, 
                            minCoverage: prev.minCoverage === coverage ? 0 : coverage 
                          }))}
                        />
                        <label htmlFor={`coverage-${coverage}`} className="ml-2 text-sm">
                          {coverage.toLocaleString('pt-BR')} ou mais
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Filtro de seguradoras */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Seguradoras</h3>
                  <div className="space-y-2">
                    {providers.map((provider) => (
                      <div key={provider.id} className="flex items-center">
                        <Checkbox
                          id={`provider-${provider.id}`}
                          checked={filters.providers.includes(provider.id)}
                          onCheckedChange={() => handleProviderFilterChange(provider.id)}
                        />
                        <label htmlFor={`provider-${provider.id}`} className="ml-2 text-sm">
                          {provider.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Filtro de benefícios */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-3">Benefícios</h3>
                  <div className="space-y-2">
                    {allBenefits.map((benefit) => (
                      <div key={benefit} className="flex items-center">
                        <Checkbox
                          id={`benefit-${benefit}`}
                          checked={filters.benefits.includes(benefit)}
                          onCheckedChange={() => handleBenefitFilterChange(benefit)}
                        />
                        <label htmlFor={`benefit-${benefit}`} className="ml-2 text-sm">
                          {benefit}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Botão limpar filtros */}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setFilters({
                    providers: [],
                    minCoverage: 0,
                    maxPrice: Math.max(...offers.map(o => o.price)) + 50,
                    benefits: [],
                  })}
                >
                  Limpar filtros
                </Button>
              </div>
            </div>
            
            {/* Conteúdo principal */}
            <div className="lg:col-span-3">
              {/* Barra de filtros móvel */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </div>
                  {isMobileFilterOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                
                {isMobileFilterOpen && (
                  <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
                    {/* Repetir os mesmos filtros da versão desktop */}
                    {/* ... filtros móveis ... */}
                  </div>
                )}
              </div>
              
              {/* Barra de ordenação */}
              <div className="flex justify-between items-center mb-4 bg-white rounded-lg shadow-sm p-3">
                <div className="text-sm font-medium">
                  {filteredOffers.length} ofertas encontradas
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={sortBy === "price" ? "text-brand-600" : "text-gray-600"}
                    onClick={() => handleSortChange("price")}
                  >
                    Preço
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={sortBy === "coverage" ? "text-brand-600" : "text-gray-600"}
                    onClick={() => handleSortChange("coverage")}
                  >
                    Cobertura
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={sortBy === "rating" ? "text-brand-600" : "text-gray-600"}
                    onClick={() => handleSortChange("rating")}
                  >
                    Avaliação
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Estado de carregamento */}
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="w-full">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-6 w-1/2" />
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex justify-between flex-wrap">
                          <div className="w-1/2">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <div className="w-1/2 text-right">
                            <Skeleton className="h-4 w-20 mb-2 ml-auto" />
                            <Skeleton className="h-6 w-24 ml-auto" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-10 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {/* Lista de ofertas */}
                  {filteredOffers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                      <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma oferta encontrada
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Tente modificar seus filtros ou fazer uma nova busca com diferentes parâmetros.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setFilters({
                          providers: [],
                          minCoverage: 0,
                          maxPrice: Math.max(...offers.map(o => o.price)) + 50,
                          benefits: [],
                        })}
                      >
                        Limpar filtros
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentItems.map((offer) => {
                        const provider = providers.find(p => p.id === offer.providerId);
                        const isExpanded = expandedOffers[offer.id] || false;
                        
                        return (
                          <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card 
                              className={`w-full transition-shadow ${
                                offer.recommended ? "ring-2 ring-brand-600" : ""
                              }`}
                            >
                              {offer.recommended && (
                                <div className="bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-t-lg w-fit ml-4">
                                  Recomendado
                                </div>
                              )}
                              
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="bg-gray-100 w-8 h-8 rounded flex items-center justify-center">
                                        {/* Logo da seguradora */}
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        {provider?.name || "Seguradora"}
                                      </p>
                                    </div>
                                    <CardTitle className="text-lg">
                                      {offer.name}
                                    </CardTitle>
                                  </div>
                                  
                                  <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">Total para a viagem</p>
                                    <p className="text-xl font-bold text-brand-600">
                                      {formatPrice(offer.price)}
                                    </p>
                                  </div>
                                </div>
                              </CardHeader>
                              
                              <CardContent className="pb-3">
                                <div className="flex flex-wrap gap-y-3">
                                  <div className="w-1/2 sm:w-1/4">
                                    <p className="text-xs text-gray-500">Despesas médicas</p>
                                    <p className="font-medium">
                                      {formatPrice(offer.coverage.medical)}
                                    </p>
                                  </div>
                                  <div className="w-1/2 sm:w-1/4">
                                    <p className="text-xs text-gray-500">Bagagem</p>
                                    <p className="font-medium">
                                      {formatPrice(offer.coverage.baggage)}
                                    </p>
                                  </div>
                                  <div className="w-1/2 sm:w-1/4">
                                    <p className="text-xs text-gray-500">Cancelamento</p>
                                    <p className="font-medium">
                                      {formatPrice(offer.coverage.cancellation)}
                                    </p>
                                  </div>
                                  <div className="w-1/2 sm:w-1/4">
                                    <p className="text-xs text-gray-500">Avaliação</p>
                                    {renderRating(offer.rating)}
                                  </div>
                                </div>
                                
                                {/* Detalhes expandidos */}
                                {isExpanded && (
                                  <div className="mt-4 pt-4 border-t">
                                    <h4 className="font-medium mb-3">Detalhes da cobertura</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Cobertura</TableHead>
                                          <TableHead className="text-right">Valor</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell>Despesas médicas e hospitalares</TableCell>
                                          <TableCell className="text-right">{formatPrice(offer.coverage.medical)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Bagagem extraviada</TableCell>
                                          <TableCell className="text-right">{formatPrice(offer.coverage.baggage)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Cancelamento de viagem</TableCell>
                                          <TableCell className="text-right">{formatPrice(offer.coverage.cancellation)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Atraso de voo</TableCell>
                                          <TableCell className="text-right">{formatPrice(offer.coverage.delay)}</TableCell>
                                        </TableRow>
                                        {offer.coverage.other && Object.entries(offer.coverage.other).map(([key, value]) => (
                                          <TableRow key={key}>
                                            <TableCell>{key}</TableCell>
                                            <TableCell className="text-right">{formatPrice(value)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                    
                                    <h4 className="font-medium mt-6 mb-3">Benefícios</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {offer.benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-start gap-2">
                                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                          <span className="text-sm">{benefit}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                              
                              <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0">
                                <Button
                                  className="w-full sm:w-auto"
                                  size="lg"
                                >
                                  Contratar seguro
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  className="w-full sm:w-auto"
                                  onClick={() => toggleExpand(offer.id)}
                                >
                                  {isExpanded ? "Menos detalhes" : "Ver detalhes"}
                                  {isExpanded ? (
                                    <ChevronUp className="ml-1 h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                  )}
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Paginação */}
                  {filteredOffers.length > itemsPerPage && (
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent>
                          {currentPage > 1 && (
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setCurrentPage(currentPage - 1)} 
                                href="#"
                              />
                            </PaginationItem>
                          )}
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => 
                              page === 1 || 
                              page === totalPages || 
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            )
                            .map((page, i, arr) => {
                              // Adicionar elipses
                              if (i > 0 && arr[i - 1] !== page - 1) {
                                return (
                                  <React.Fragment key={`ellipsis-${page}`}>
                                    <PaginationItem>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                    <PaginationItem>
                                      <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        href="#"
                                        isActive={page === currentPage}
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  </React.Fragment>
                                );
                              }
                              
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    href="#"
                                    isActive={page === currentPage}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                          
                          {currentPage < totalPages && (
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setCurrentPage(currentPage + 1)}
                                href="#" 
                              />
                            </PaginationItem>
                          )}
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
      
      {/* Modal de configuração da API */}
      <ApiConfigModal 
        open={isApiConfigOpen} 
        onOpenChange={setIsApiConfigOpen} 
      />
    </div>
  );
};

export default Results;
