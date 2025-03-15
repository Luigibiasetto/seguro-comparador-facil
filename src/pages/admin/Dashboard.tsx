
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { secureRetrieve } from "@/services/security/dataSecurity";
import { Eye, Download, ListFilter } from "lucide-react";

// Mock data para demonstração
const mockPurchases = [
  { id: "PED-001", cliente: "Roberto Santos", destino: "Europa", valor: "R$ 350,00", status: "Confirmado", data: "15/05/2023" },
  { id: "PED-002", cliente: "Carla Mendes", destino: "Estados Unidos", valor: "R$ 420,00", status: "Pendente", data: "17/05/2023" },
  { id: "PED-003", cliente: "Fernando Lima", destino: "Ásia", valor: "R$ 580,00", status: "Confirmado", data: "20/05/2023" },
  { id: "PED-004", cliente: "Ana Beatriz", destino: "América do Sul", valor: "R$ 280,00", status: "Cancelado", data: "22/05/2023" },
  { id: "PED-005", cliente: "Marcelo Costa", destino: "Oceania", valor: "R$ 670,00", status: "Confirmado", data: "25/05/2023" },
];

// Mock data para cotações
const mockQuotes = [
  { 
    id: "COT-001", 
    cliente: "Maria Silva", 
    telefone: "(11) 98765-4321", 
    destino: "Europa", 
    dataIda: "10/06/2023", 
    dataVolta: "25/06/2023", 
    passageiros: "2 adultos (34, 32 anos)", 
    dataConsulta: "01/05/2023", 
    status: "Não convertida" 
  },
  { 
    id: "COT-002", 
    cliente: "João Oliveira", 
    telefone: "(21) 97654-3210", 
    destino: "América do Norte", 
    dataIda: "15/07/2023", 
    dataVolta: "30/07/2023", 
    passageiros: "1 adulto (29 anos)", 
    dataConsulta: "02/05/2023", 
    status: "Convertida" 
  },
  { 
    id: "COT-003", 
    cliente: "Luiza Mendes", 
    telefone: "(47) 99876-5432", 
    destino: "Ásia", 
    dataIda: "05/08/2023", 
    dataVolta: "20/08/2023", 
    passageiros: "2 adultos (40, 38 anos), 1 criança (10 anos)", 
    dataConsulta: "05/05/2023", 
    status: "Não convertida" 
  },
  { 
    id: "COT-004", 
    cliente: "Carlos Eduardo", 
    telefone: "(31) 98765-1234", 
    destino: "América do Sul", 
    dataIda: "22/06/2023", 
    dataVolta: "30/06/2023", 
    passageiros: "4 adultos (45, 43, 25, 23 anos)", 
    dataConsulta: "07/05/2023", 
    status: "Aguardando retorno" 
  },
  { 
    id: "COT-005", 
    cliente: "Amanda Souza", 
    telefone: "(19) 99432-8765", 
    destino: "Oceania", 
    dataIda: "10/09/2023", 
    dataVolta: "01/10/2023", 
    passageiros: "2 adultos (35, 33 anos)", 
    dataConsulta: "10/05/2023", 
    status: "Convertida" 
  },
  { 
    id: "COT-006", 
    cliente: "Paulo Ricardo", 
    telefone: "(14) 98234-5678", 
    destino: "África", 
    dataIda: "15/10/2023", 
    dataVolta: "30/10/2023", 
    passageiros: "2 adultos (50, 48 anos)", 
    dataConsulta: "12/05/2023", 
    status: "Não convertida" 
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  useEffect(() => {
    const adminAuth = secureRetrieve<{ authenticated: boolean }>("admin-auth");
    if (!adminAuth?.authenticated) {
      navigate("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
  };
  
  const handleViewQuoteDetails = (quote: any) => {
    setSelectedQuote(quote);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Confirmado":
      case "Convertida":
        return "bg-green-100 text-green-800";
      case "Pendente":
      case "Aguardando retorno":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelado":
      case "Não convertida":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">Painel Administrativo</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem("admin-auth");
              navigate("/admin/login");
            }}
          >
            Sair
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-gray-600">Total de Vendas (Mês)</p>
              <p className="text-2xl font-bold text-gray-900">R$ 45.780,00</p>
              <p className="text-xs text-green-600 mt-2">↑ 12% desde o mês passado</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900">1.248</p>
              <p className="text-xs text-blue-600 mt-2">↑ 5% desde o mês passado</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <p className="text-sm text-gray-600">Cotações Recebidas</p>
              <p className="text-2xl font-bold text-gray-900">186</p>
              <p className="text-xs text-purple-600 mt-2">↑ 15% desde o mês passado</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <Tabs defaultValue="cotacoes">
            <TabsList className="mb-6">
              <TabsTrigger value="cotacoes">Cotações</TabsTrigger>
              <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
              <TabsTrigger value="clientes">Clientes</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cotacoes">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Cotações de Clientes</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ListFilter className="h-4 w-4" />
                    <span>Filtrar</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>Exportar</span>
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Passageiros</TableHead>
                      <TableHead>Data Consulta</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockQuotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.id}</TableCell>
                        <TableCell>{quote.cliente}</TableCell>
                        <TableCell>{quote.telefone}</TableCell>
                        <TableCell>{quote.destino}</TableCell>
                        <TableCell>{quote.passageiros}</TableCell>
                        <TableCell>{quote.dataConsulta}</TableCell>
                        <TableCell>
                          <span 
                            className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusClass(quote.status)}`}
                          >
                            {quote.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewQuoteDetails(quote)}
                                className="flex items-center gap-1"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Detalhes</span>
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px]">
                              <SheetHeader>
                                <SheetTitle>Detalhes da Cotação {selectedQuote?.id}</SheetTitle>
                              </SheetHeader>
                              {selectedQuote && (
                                <div className="py-6">
                                  <dl className="space-y-4">
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Cliente:</dt>
                                      <dd className="text-sm text-gray-900">{selectedQuote.cliente}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Telefone:</dt>
                                      <dd className="text-sm text-gray-900">{selectedQuote.telefone}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Destino:</dt>
                                      <dd className="text-sm text-gray-900">{selectedQuote.destino}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Data de Ida:</dt>
                                      <dd className="text-sm text-gray-900">{selectedQuote.dataIda}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Data de Volta:</dt>
                                      <dd className="text-sm text-gray-900">{selectedQuote.dataVolta}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Passageiros:</dt>
                                      <dd className="text-sm text-gray-900">{selectedQuote.passageiros}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Data da Consulta:</dt>
                                      <dd className="text-sm text-gray-900">{selectedQuote.dataConsulta}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Status:</dt>
                                      <dd className="text-sm text-gray-900">{selectedQuote.status}</dd>
                                    </div>
                                  </dl>
                                  <div className="mt-6 space-y-3">
                                    <Button className="w-full" variant="outline">
                                      Marcar como Convertida
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                      Enviar Email
                                    </Button>
                                    <Button className="w-full" variant="default">
                                      Ligar para Cliente
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="pedidos">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPurchases.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.cliente}</TableCell>
                        <TableCell>{order.destino}</TableCell>
                        <TableCell>{order.valor}</TableCell>
                        <TableCell>
                          <span 
                            className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>{order.data}</TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(order)}
                                className="flex items-center gap-1"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Detalhes</span>
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px]">
                              <SheetHeader>
                                <SheetTitle>Detalhes do Pedido {selectedOrder?.id}</SheetTitle>
                              </SheetHeader>
                              {selectedOrder && (
                                <div className="py-6">
                                  <dl className="space-y-4">
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Cliente:</dt>
                                      <dd className="text-sm text-gray-900">{selectedOrder.cliente}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Destino:</dt>
                                      <dd className="text-sm text-gray-900">{selectedOrder.destino}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Valor:</dt>
                                      <dd className="text-sm text-gray-900">{selectedOrder.valor}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Status:</dt>
                                      <dd className="text-sm text-gray-900">{selectedOrder.status}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-sm font-medium text-gray-500">Data:</dt>
                                      <dd className="text-sm text-gray-900">{selectedOrder.data}</dd>
                                    </div>
                                  </dl>
                                  <div className="mt-6 space-y-3">
                                    <Button className="w-full" variant="outline">
                                      Imprimir Detalhes
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                      Enviar por Email
                                    </Button>
                                    <Button className="w-full" variant={selectedOrder.status === "Cancelado" ? "default" : "destructive"}>
                                      {selectedOrder.status === "Cancelado" ? "Reativar Pedido" : "Cancelar Pedido"}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="clientes">
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-600">Gerenciamento de Clientes</h3>
                <p className="text-gray-500 mt-2">Esta seção será implementada em breve.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="relatorios">
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-600">Relatórios Avançados</h3>
                <p className="text-gray-500 mt-2">Esta seção será implementada em breve.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
