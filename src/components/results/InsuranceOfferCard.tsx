
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { secureStore } from "@/services/security/dataSecurity";
import { InsuranceOffer, InsuranceProvider } from "@/services/insuranceApi";

interface InsuranceOfferCardProps {
  offer: InsuranceOffer;
  providers: InsuranceProvider[];
  formatPrice: (price: number) => string;
  searchParams?: any;
}

const InsuranceOfferCard = ({
  offer,
  providers,
  formatPrice,
  searchParams
}: InsuranceOfferCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  
  const handleBuy = () => {
    // Store selected offer and search parameters in localStorage
    secureStore('selectedOffer', offer);
    secureStore('selectedProvider', providers.find(p => p.id === offer.providerId));
    if (searchParams) {
      secureStore('searchParams', searchParams);
    }
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">
                  {providers.find(p => p.id === offer.providerId)?.name || "Seguradora"}
                </h3>
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
              <Button onClick={handleBuy}>Contratar</Button>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>Mostrar menos <ChevronUp className="ml-1 h-3 w-3" /></>
              ) : (
                <>Ver detalhes <ChevronDown className="ml-1 h-3 w-3" /></>
              )}
            </Button>
          </div>
        </div>
        
        {isExpanded && (
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
                      <TableCell>Bagagem</TableCell>
                      <TableCell className="text-right">{formatPrice(offer.coverage.baggage)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cancelamento</TableCell>
                      <TableCell className="text-right">{formatPrice(offer.coverage.cancellation)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Atraso</TableCell>
                      <TableCell className="text-right">{formatPrice(offer.coverage.delay)}</TableCell>
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
  );
};

export default InsuranceOfferCard;
