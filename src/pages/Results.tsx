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
          <

