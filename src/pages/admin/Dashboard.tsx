
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { secureRetrieve } from "@/services/security/dataSecurity";

// Mock data para demonstração
const mockPurchases = [
  { id: "PED-001", cliente: "Roberto Santos", destino: "Europa", valor: "R$ 350,00", status: "Confirmado", data: "15/05/2023" },
  { id: "PED-002", cliente: "Carla Mendes", destino: "Estados Unidos", valor: "R$ 420,00", status: "Pendente", data: "17/05/2023" },
  { id: "PED-003", cliente: "Fernando Lima", destino: "Ásia", valor: "R$ 580,00", status: "Confirmado", data: "20/05/2023" },
  { id: "PED-004", cliente: "Ana Beatriz", destino: "América do Sul", valor: "R$ 280,00", status: "Cancelado", data: "22/05/2023" },
  { id: "PED-005", cliente: "Marcelo Costa", destino: "Oceania", valor: "R$ 670,00", status: "Confirmado", data: "25/05/2023" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
              <p className="text-sm text-gray-600">Apólices Ativas</p>
              <p className="text-2xl font-bold text-gray-900">3.752</p>
              <p className="text-xs text-purple-600 mt-2">↑ 8% desde o mês passado</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <Tabs defaultValue="pedidos">
            <TabsList className="mb-6">
              <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
              <TabsTrigger value="clientes">Clientes</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>
            
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
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              order.status === "Confirmado" ? "bg-green-100 text-green-800" : 
                              order.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : 
                              "bg-red-100 text-red-800"
                            }`}
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
                              >
                                Detalhes
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
