
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, ChevronUp, Shield, Clock, MapPin } from "lucide-react";
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

  const provider = providers.find(p => p.id === offer.providerId) || { name: "Seguradora", logo: "/placeholder.svg" };

  // Destaque para planos recomendados
  const isRecommended = offer.recommended;

  return (
    <Card className={`overflow-hidden transition-all duration-200 ${isRecommended ? 'border-primary border-2 shadow-lg' : ''}`}>
      {isRecommended && (
        <div className="bg-primary text-white text-center py-1 text-xs font-medium">
          PLANO RECOMENDADO
        </div>
      )}
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">
                  {provider.name}
                </h3>
                {offer.rating >= 4.5 && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Excelente
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground text-sm mb-2">
                {offer.name}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-3">
                <div className="flex items-center text-sm">
                  <Shield className="w-4 h-4 mr-1 text-primary" />
                  <span>Médica: {formatPrice(offer.coverage.medical)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-1 text-primary" />
                  <span>Atendimento 24h</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1 text-primary" />
                  <span>Cobertura Mundial</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {/* Fazemos a deduplicação de benefícios e usamos o índice como parte da key */}
                {Array.from(new Set(offer.benefits)).slice(0, 3).map((benefit, index) => (
                  <div key={`${benefit}-${index}`} className="bg-muted px-2 py-1 rounded-md text-xs flex items-center">
                    <Check className="w-3 h-3 mr-1 text-green-500" />
                    {benefit}
                  </div>
                ))}
                {offer.benefits.length > 3 && (
                  <div className="bg-muted px-2 py-1 rounded-md text-xs">
                    +{Array.from(new Set(offer.benefits)).length - 3} benefícios
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(offer.price)}
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                por pessoa para toda a viagem
              </div>
              <Button 
                onClick={handleBuy}
                className={`${isRecommended ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                Contratar
              </Button>
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
                      <TableCell className="text-right font-medium">{formatPrice(offer.coverage.medical)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bagagem</TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(offer.coverage.baggage)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cancelamento</TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(offer.coverage.cancellation)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Atraso</TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(offer.coverage.delay)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Benefícios</h4>
                <div className="grid grid-cols-1 gap-2">
                  {/* Use de Set para remover duplicatas e adicione índice na key */}
                  {Array.from(new Set(offer.benefits)).map((benefit, index) => (
                    <div key={`${benefit}-${index}`} className="flex items-center gap-2">
                      <Check className="text-green-500 w-4 h-4" />
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
