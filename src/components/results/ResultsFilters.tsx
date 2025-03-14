
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";
import { InsuranceProvider } from "@/services/insuranceApi";

interface FilterState {
  providers: string[];
  minCoverage: number;
  maxPrice: number | null;
  benefits: string[];
}

interface ResultsFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  providers: InsuranceProvider[];
  allBenefits: string[];
  maxOfferPrice: number;
  formatPrice: (price: number) => string;
}

const ResultsFilters = ({
  filters,
  setFilters,
  providers,
  allBenefits,
  maxOfferPrice,
  formatPrice
}: ResultsFiltersProps) => {
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

  return (
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
                max={maxOfferPrice}
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
  );
};

export default ResultsFilters;
