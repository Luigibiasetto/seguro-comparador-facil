
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EyeIcon, RefreshCcw, Trash2, CheckCircle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AbandonedCart, CustomerInfo } from '@/services/api/types';
import { getAbandonedCarts, markCartAsRecovered, deleteAbandonedCart } from '@/services/abandonedCartService';

const AbandonedCarts = () => {
  const navigate = useNavigate();
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Verificar se o usuário está autenticado
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error('Você precisa estar logado para acessar esta página');
          navigate('/auth', { state: { from: '/admin/abandoned-carts' } });
          return;
        }

        // Verificar se o usuário é um administrador
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (error || !data) {
          toast.error('Você não tem permissão para acessar esta página');
          navigate('/');
          return;
        }

        setIsAdmin(true);
        fetchCarts();
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        toast.error('Erro ao verificar permissões');
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const cartsData = await getAbandonedCarts();
      setCarts(cartsData);
    } catch (error) {
      console.error('Erro ao buscar carrinhos abandonados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCart = (cart: AbandonedCart) => {
    setSelectedCart(cart);
  };

  const handleMarkAsRecovered = async (id: string) => {
    try {
      const success = await markCartAsRecovered(id);
      if (success) {
        toast.success('Carrinho marcado como recuperado');
        fetchCarts(); // Recarregar a lista
      }
    } catch (error) {
      console.error('Erro ao marcar carrinho como recuperado:', error);
      toast.error('Erro ao atualizar carrinho');
    }
  };

  const handleDeleteCart = async (id: string) => {
    try {
      const success = await deleteAbandonedCart(id);
      if (success) {
        toast.success('Carrinho excluído com sucesso');
        setSelectedCart(null); // Fechar o diálogo se estiver aberto
        fetchCarts(); // Recarregar a lista
      }
    } catch (error) {
      console.error('Erro ao excluir carrinho:', error);
      toast.error('Erro ao excluir carrinho');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Verificando permissões...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Carrinhos Abandonados</CardTitle>
              <CardDescription>
                Visualize e gerencie os carrinhos abandonados pelos usuários
              </CardDescription>
            </div>
            <Button onClick={fetchCarts} variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando carrinhos abandonados...</div>
          ) : carts.length === 0 ? (
            <div className="text-center py-8">Nenhum carrinho abandonado encontrado</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carts.map((cart) => (
                  <TableRow key={cart.id}>
                    <TableCell>{cart.email}</TableCell>
                    <TableCell>{cart.phone}</TableCell>
                    <TableCell>{cart.destination}</TableCell>
                    <TableCell>{cart.created_at ? formatDate(cart.created_at) : 'N/A'}</TableCell>
                    <TableCell>
                      {cart.recovered ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Recuperado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Abandonado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewCart(cart)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Carrinho Abandonado</DialogTitle>
                              <DialogDescription>
                                Informações completas do carrinho abandonado
                              </DialogDescription>
                            </DialogHeader>
                            {selectedCart && (
                              <div className="space-y-4 mt-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-medium text-sm text-gray-500">Informações Básicas</h3>
                                    <div className="mt-2 space-y-2">
                                      <p><span className="font-medium">Email:</span> {selectedCart.email}</p>
                                      <p><span className="font-medium">Telefone:</span> {selectedCart.phone}</p>
                                      <p><span className="font-medium">Criado em:</span> {selectedCart.created_at ? formatDate(selectedCart.created_at) : 'N/A'}</p>
                                      <p><span className="font-medium">Status:</span> {selectedCart.recovered ? 'Recuperado' : 'Abandonado'}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-sm text-gray-500">Detalhes da Viagem</h3>
                                    <div className="mt-2 space-y-2">
                                      <p><span className="font-medium">Origem:</span> {selectedCart.origin}</p>
                                      <p><span className="font-medium">Destino:</span> {selectedCart.destination}</p>
                                      <p><span className="font-medium">Data de Ida:</span> {formatDate(selectedCart.departure_date)}</p>
                                      <p><span className="font-medium">Data de Volta:</span> {formatDate(selectedCart.return_date)}</p>
                                      <p><span className="font-medium">Passageiros:</span> {selectedCart.passengers.adults} adultos, {selectedCart.passengers.children} crianças</p>
                                    </div>
                                  </div>
                                </div>

                                {selectedCart.customer_info && (
                                  <div>
                                    <h3 className="font-medium text-sm text-gray-500 mt-4">Informações do Cliente</h3>
                                    <div className="mt-2 grid md:grid-cols-2 gap-4">
                                      <div>
                                        <p><span className="font-medium">Nome:</span> {selectedCart.customer_info.fullName}</p>
                                        <p><span className="font-medium">Documento:</span> {selectedCart.customer_info.documentType === 'cpf' ? 'CPF' : 'Passaporte'}: {selectedCart.customer_info.documentNumber}</p>
                                        <p><span className="font-medium">Data de Nascimento:</span> {selectedCart.customer_info.birthDate}</p>
                                        <p><span className="font-medium">Email:</span> {selectedCart.customer_info.email}</p>
                                        <p><span className="font-medium">Telefone:</span> {selectedCart.customer_info.phone}</p>
                                      </div>
                                      <div>
                                        <p><span className="font-medium">Contato de Emergência:</span> {selectedCart.customer_info.emergencyContact.name} - {selectedCart.customer_info.emergencyContact.phone}</p>
                                        <p><span className="font-medium">Endereço:</span> {selectedCart.customer_info.address.street}, {selectedCart.customer_info.address.number}</p>
                                        <p><span className="font-medium">Complemento:</span> {selectedCart.customer_info.address.complement || 'N/A'}</p>
                                        <p><span className="font-medium">CEP:</span> {selectedCart.customer_info.address.zipCode}</p>
                                        <p><span className="font-medium">Cidade/Estado:</span> {selectedCart.customer_info.address.city}, {selectedCart.customer_info.address.state}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {selectedCart.offer_data && (
                                  <div>
                                    <h3 className="font-medium text-sm text-gray-500 mt-4">Oferta Selecionada</h3>
                                    <div className="mt-2">
                                      <p><span className="font-medium">Seguro:</span> {selectedCart.offer_data.name}</p>
                                      <p><span className="font-medium">Preço:</span> R$ {selectedCart.offer_data.price.toFixed(2)}</p>
                                      <p><span className="font-medium">Provedor:</span> {selectedCart.provider_data?.name || 'N/A'}</p>
                                      <div className="mt-2">
                                        <span className="font-medium">Coberturas:</span>
                                        <ul className="list-disc pl-5 mt-1">
                                          <li>Médica: R$ {selectedCart.offer_data.coverage.medical.toLocaleString()}</li>
                                          <li>Bagagem: R$ {selectedCart.offer_data.coverage.baggage.toLocaleString()}</li>
                                          <li>Cancelamento: R$ {selectedCart.offer_data.coverage.cancellation.toLocaleString()}</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            <DialogFooter className="mt-6">
                              <div className="flex space-x-2 justify-between w-full">
                                <Button
                                  variant="destructive"
                                  onClick={() => selectedCart?.id && handleDeleteCart(selectedCart.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => selectedCart?.id && !selectedCart.recovered && handleMarkAsRecovered(selectedCart.id)}
                                  disabled={selectedCart?.recovered}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Marcar como Recuperado
                                </Button>
                              </div>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {!cart.recovered && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => cart.id && handleMarkAsRecovered(cart.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => cart.id && handleDeleteCart(cart.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AbandonedCarts;
