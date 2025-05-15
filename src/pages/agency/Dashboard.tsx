import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2, Users, ShoppingBag, BarChart3, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Agency, AgencyTableData } from "@/services/api/types/agency";

const AgencyDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [agencyData, setAgencyData] = useState<Agency | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [salesCount, setSalesCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          navigate('/agency/login');
          return;
        }
        
        // Buscar dados da agência usando SQL raw
        const { data: agencyData, error } = await supabase
          .from('agencies')
          .select('*')
          .eq('user_id', data.session.user.id)
          .maybeSingle();
        
        if (error || !agencyData) {
          console.error("Erro ao carregar dados da agência:", error);
          await supabase.auth.signOut();
          navigate('/agency/login');
          return;
        }
        
        // Converter de AgencyTableData para Agency
        setAgencyData(agencyData as unknown as Agency);
        
        // Dados mockados para demonstração
        setSalesCount(12);
        setTotalRevenue(8750);
        setTotalCommission((agencyData?.commission_rate || 0) * 8750 / 100);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/agency/login');
    toast.success('Logout realizado com sucesso');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 flex items-center justify-center">
          <div className="text-center">
            <p>Carregando dados da agência...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Portal da Agência</h1>
              <p className="text-gray-600">Bem-vindo, {agencyData?.name}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="mt-4 md:mt-0">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Vendas</p>
                    <h3 className="text-xl font-bold">{salesCount}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Faturamento</p>
                    <h3 className="text-xl font-bold">R$ {totalRevenue.toFixed(2)}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Comissão ({agencyData?.commission_rate}%)</p>
                    <h3 className="text-xl font-bold">R$ {totalCommission.toFixed(2)}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="sales">Vendas</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Conta</CardTitle>
                  <CardDescription>
                    Informações gerais sobre sua conta de agência
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Agência</h3>
                      <p className="font-medium">{agencyData?.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">CNPJ</h3>
                      <p className="font-medium">{agencyData?.cnpj}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Responsável</h3>
                      <p className="font-medium">{agencyData?.responsible_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <div className="flex items-center">
                        <span 
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            agencyData?.status === 'active' ? 'bg-green-500' : 
                            agencyData?.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        ></span>
                        <p className="font-medium capitalize">
                          {agencyData?.status === 'active' ? 'Ativo' : 
                           agencyData?.status === 'pending' ? 'Pendente' : 'Inativo'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="font-medium">{agencyData?.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                      <p className="font-medium">{agencyData?.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Iniciar Nova Venda</h2>
                <Card>
                  <CardContent className="p-6">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => navigate('/agency/new-sale')}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Iniciar Cotação
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Vendas</CardTitle>
                  <CardDescription>
                    Gerencie as vendas realizadas por sua agência
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">
                    Dados de vendas serão exibidos aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Agência</CardTitle>
                  <CardDescription>
                    Altere as configurações da sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="commission">Taxa de Comissão (%)</Label>
                      <Input 
                        id="commission" 
                        type="number" 
                        min="0" 
                        max="60" 
                        value={agencyData?.commission_rate || 0}
                        disabled 
                        className="max-w-xs"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Para alterar sua taxa de comissão, entre em contato com o suporte.
                      </p>
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

export default AgencyDashboard;
