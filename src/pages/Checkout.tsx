
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { secureRetrieve } from '@/services/security/dataSecurity';
import { InsuranceOffer, InsuranceProvider, SearchParams, CustomerInfo } from '@/services/api/types';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import CustomerForm from '@/components/checkout/CustomerForm';
import PaymentForm from '@/components/checkout/PaymentForm';

const Checkout = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customer-info');
  const [offer, setOffer] = useState<InsuranceOffer | null>(null);
  const [provider, setProvider] = useState<InsuranceProvider | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  
  useEffect(() => {
    const storedOffer = secureRetrieve<InsuranceOffer>('selectedOffer');
    const storedProvider = secureRetrieve<InsuranceProvider>('selectedProvider');
    const storedParams = secureRetrieve<SearchParams>('searchParams');
    
    if (!storedOffer || !storedProvider || !storedParams) {
      toast.error('Informações do seguro não encontradas. Por favor, selecione um seguro novamente.');
      navigate('/resultados');
      return;
    }
    
    setOffer(storedOffer);
    setProvider(storedProvider);
    setSearchParams(storedParams);
  }, [navigate]);
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const handleCustomerSubmit = (data: CustomerInfo) => {
    setCustomerInfo(data);
    setActiveTab('payment');
  };
  
  const handlePaymentSubmit = (paymentMethod: 'pix' | 'creditCard', creditCardInfo?: any) => {
    // Here you would typically process the payment and create the order
    toast.success('Compra finalizada com sucesso!');
    
    // Simulate a payment process (in a real app, this would be an API call)
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  const handleBackToResults = () => {
    navigate('/resultados');
  };
  
  if (!offer || !provider || !searchParams) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
          <p>Carregando informações do seguro...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  const isBrazilianOrigin = searchParams.origin.toLowerCase().includes('brasil');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="items-center gap-1" 
              onClick={handleBackToResults}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos resultados
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Finalize sua compra</CardTitle>
                </CardHeader>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="customer-info" disabled={activeTab === 'payment'}>
                      <div className="flex items-center gap-2">
                        {activeTab === 'payment' && <Check className="w-4 h-4" />}
                        Informações Pessoais
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="payment" disabled={!customerInfo}>
                      Pagamento
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="customer-info">
                    <CustomerForm 
                      isBrazilianOrigin={isBrazilianOrigin}
                      onSubmit={handleCustomerSubmit}
                    />
                  </TabsContent>
                  
                  <TabsContent value="payment">
                    <PaymentForm 
                      offer={offer}
                      formatPrice={formatPrice}
                      onSubmit={handlePaymentSubmit}
                    />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
            
            <div>
              <CheckoutSummary 
                offer={offer}
                provider={provider}
                searchParams={searchParams}
                formatPrice={formatPrice}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
