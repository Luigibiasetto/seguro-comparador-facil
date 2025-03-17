
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InsuranceOffer, InsuranceProvider } from '@/services/api/types';
import { LogOut, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Order {
  id: string;
  created_at: string;
  offer: InsuranceOffer;
  provider: InsuranceProvider;
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  status: 'ativo' | 'expirado' | 'cancelado';
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth', { state: { from: '/profile' } });
        return;
      }
      
      setUserProfile({
        id: session.user?.id,
        email: session.user?.email,
        name: session.user?.user_metadata?.name || 'Cliente',
      });
      
      setLoading(false);
      fetchOrders(session.user.id);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchOrders = async (userId: string) => {
    setLoading(true);
    try {
      // Exemplo de função para buscar pedidos
      // Em um caso real, você implementaria a busca no banco de dados
      // Aqui estamos apenas simulando dados para demonstração
      const mockOrders: Order[] = [
        {
          id: "ord-001",
          created_at: new Date().toISOString(),
          offer: {
            id: "offer-1",
            providerId: "assist-card",
            name: "Assist Card 100",
            price: 249.90,
            coverage: {
              medical: 100000,
              baggage: 1200,
              cancellation: 3000,
              delay: 500
            },
            benefits: ["Telemedicina", "Cobertura COVID", "App de emergência"],
            rating: 4.7,
            recommended: true
          },
          provider: {
            id: "assist-card",
            name: "Assist Card",
            logo: "/placeholder.svg"
          },
          origin: "Brasil",
          destination: "Portugal",
          departure_date: "2024-05-15T00:00:00.000Z",
          return_date: "2024-05-30T00:00:00.000Z",
          status: "ativo"
        },
        {
          id: "ord-002",
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          offer: {
            id: "offer-2",
            providerId: "coris",
            name: "Coris Europa Premium",
            price: 319.90,
            coverage: {
              medical: 150000,
              baggage: 1500,
              cancellation: 4000,
              delay: 700
            },
            benefits: ["Telemedicina", "Cobertura COVID", "Localização de bagagem"],
            rating: 4.5,
            recommended: false
          },
          provider: {
            id: "coris",
            name: "Coris Seguros",
            logo: "/placeholder.svg"
          },
          origin: "Brasil",
          destination: "Itália",
          departure_date: "2023-12-10T00:00:00.000Z",
          return_date: "2023-12-20T00:00:00.000Z",
          status: "expirado"
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast.error("Erro ao carregar suas compras");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Você foi desconectado com sucesso");
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const handlePrintInsurance = (order: Order) => {
    // Em uma implementação real, isso geraria um PDF ou redirecionaria para uma página de impressão
    toast.success(`Seguro ${order.offer.name} pronto para impressão`);
    // Abrir uma nova janela com os detalhes formatados para impressão seria o próximo passo
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Seguro Viagem - ${order.offer.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .insurance-details { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; }
              .section { margin-bottom: 15px; }
              .section-title { font-weight: bold; margin-bottom: 5px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              @media print { 
                button { display: none; } 
                body { margin: 0; } 
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Seguro Viagem</h1>
              <h2>${order.provider.name} - ${order.offer.name}</h2>
              <p>Número do pedido: ${order.id}</p>
            </div>
            
            <div class="insurance-details">
              <div class="section">
                <div class="section-title">Destino:</div>
                <p>${order.destination}</p>
              </div>
              
              <div class="section">
                <div class="section-title">Período:</div>
                <p>De ${format(new Date(order.departure_date), 'dd/MM/yyyy', { locale: ptBR })} a 
                   ${format(new Date(order.return_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
              
              <div class="section">
                <div class="section-title">Status:</div>
                <p>${order.status === 'ativo' ? 'Ativo' : order.status === 'expirado' ? 'Expirado' : 'Cancelado'}</p>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Coberturas:</div>
              <table>
                <tr>
                  <th>Tipo de Cobertura</th>
                  <th>Valor</th>
                </tr>
                <tr>
                  <td>Despesas médicas</td>
                  <td>USD ${order.offer.coverage.medical.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Bagagem</td>
                  <td>USD ${order.offer.coverage.baggage.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Cancelamento</td>
                  <td>USD ${order.offer.coverage.cancellation.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Atraso</td>
                  <td>USD ${order.offer.coverage.delay.toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            <div class="section">
              <div class="section-title">Benefícios inclusos:</div>
              <ul>
                ${order.offer.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
              </ul>
            </div>
            
            <div style="margin-top: 40px; text-align: center;">
              <p>Este documento serve como comprovante de seu seguro viagem.</p>
              <p>Em caso de emergência, entre em contato: +55 11 0000-0000</p>
            </div>
            
            <button onclick="window.print()" style="display: block; margin: 20px auto; padding: 10px 20px;">
              Imprimir
            </button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Olá, {userProfile?.name}!</h1>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>

          <Tabs defaultValue="orders">
            <TabsList className="mb-6">
              <TabsTrigger value="orders">Meus Seguros</TabsTrigger>
              <TabsTrigger value="account">Minha Conta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders">
              <div className="space-y-6">
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">Você ainda não possui seguros comprados.</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => navigate('/')}
                      >
                        Buscar Seguros
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">
                              {order.provider.name} - {order.offer.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Pedido #{order.id} • {format(new Date(order.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${order.status === 'ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'expirado' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-red-100 text-red-800'}`}>
                            {order.status === 'ativo' 
                              ? 'Ativo' 
                              : order.status === 'expirado' 
                                ? 'Expirado' 
                                : 'Cancelado'}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium">Destino</p>
                            <p>{order.destination}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Período</p>
                            <p>
                              {format(new Date(order.departure_date), 'dd/MM/yyyy', { locale: ptBR })} a {' '}
                              {format(new Date(order.return_date), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Valor</p>
                            <p>
                              {order.offer.price.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePrintInsurance(order)}
                            disabled={order.status !== 'ativo'}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Imprimir Seguro
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Nome</p>
                      <p>{userProfile?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Email</p>
                      <p>{userProfile?.email}</p>
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" /> Sair da conta
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
