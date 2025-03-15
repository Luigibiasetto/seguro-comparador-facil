
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsuranceOffer, InsuranceProvider, SearchParams } from "@/services/api/types";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CheckoutSummaryProps {
  offer: InsuranceOffer;
  provider: InsuranceProvider;
  searchParams: SearchParams;
  formatPrice: (price: number) => string;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ 
  offer, 
  provider, 
  searchParams,
  formatPrice 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Resumo da compra</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b">
          <div className="font-medium">{provider.name}</div>
          <div>{offer.name}</div>
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Origem:</span>
            <span className="font-medium">{searchParams.origin}</span>
          </div>
          <div className="flex justify-between">
            <span>Destino:</span>
            <span className="font-medium">{searchParams.destination}</span>
          </div>
          <div className="flex justify-between">
            <span>Data de ida:</span>
            <span className="font-medium">{formatDate(searchParams.departureDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Data de volta:</span>
            <span className="font-medium">{formatDate(searchParams.returnDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Passageiros:</span>
            <span className="font-medium">{searchParams.passengers.count}</span>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex justify-between font-medium">
            <span>Valor total:</span>
            <span className="text-lg text-primary">{formatPrice(offer.price)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
