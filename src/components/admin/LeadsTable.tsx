
import { useEffect, useState } from "react";
import { Lead, Json } from "@/services/api/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar leads:", error);
        toast.error("Erro ao carregar leads");
        return;
      }

      // Converter do formato do banco para o formato do frontend
      const formattedLeads: Lead[] = (data || []).map(item => {
        const passengersData = typeof item.passengers === 'string' 
          ? JSON.parse(item.passengers) 
          : item.passengers;
          
        return {
          id: item.id,
          email: item.email,
          phone: item.phone,
          origin: item.origin,
          destination: item.destination,
          departureDate: item.departure_date,
          returnDate: item.return_date,
          departure_date: item.departure_date,
          return_date: item.return_date,
          passengers: {
            adults: passengersData.adults || 0,
            children: passengersData.children || 0,
            ages: passengersData.ages || [],
            count: passengersData.count
          },
          created_at: item.created_at
        };
      });

      setLeads(formattedLeads);
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "Data inválida";
    
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const formatPassengers = (passengers: any) => {
    if (!passengers) return "N/A";
    
    const adultsText = passengers.adults === 1 ? "1 adulto" : `${passengers.adults} adultos`;
    const childrenText = passengers.children === 1 ? "1 criança" : `${passengers.children} crianças`;
    
    if (passengers.children > 0) {
      return `${adultsText}, ${childrenText}`;
    }
    return adultsText;
  };

  const getDestinationName = (destinationCode: string) => {
    const destinations: Record<string, string> = {
      "NAMERICA": "América do Norte",
      "SAMERICA": "América do Sul",
      "EUROPE": "Europa",
      "ASIA": "Ásia",
      "AFRICA": "África",
      "OCEANIA": "Oceania"
    };
    
    return destinations[destinationCode] || destinationCode;
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      toast.error("Não há leads para exportar");
      return;
    }

    try {
      // Criar cabeçalho do CSV
      const headers = [
        "ID",
        "Email",
        "Telefone",
        "Origem",
        "Destino",
        "Data de Ida",
        "Data de Volta",
        "Passageiros",
        "Data de Criação"
      ].join(",");

      // Criar linhas do CSV
      const rows = leads.map(lead => [
        lead.id,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        lead.origin === "BR" ? "Brasil" : "Estrangeiro",
        getDestinationName(lead.destination),
        formatDate(lead.departureDate),
        formatDate(lead.returnDate),
        formatPassengers(lead.passengers),
        lead.created_at ? formatDate(lead.created_at) : "N/A"
      ].join(","));

      // Juntar cabeçalho e linhas
      const csvContent = [headers, ...rows].join("\n");

      // Criar blob e link para download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `leads_${format(new Date(), "yyyy-MM-dd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Arquivo CSV gerado com sucesso");
    } catch (error) {
      console.error("Erro ao exportar para CSV:", error);
      toast.error("Erro ao gerar arquivo CSV");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse text-gray-600">Carregando leads...</div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-600">Nenhum lead cadastrado</h3>
        <p className="text-gray-500 mt-2">
          Os leads serão exibidos aqui quando os clientes preencherem o formulário na página inicial.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Leads Recebidos ({leads.length})</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={exportToCSV}
        >
          <Download className="h-4 w-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Data de Ida</TableHead>
              <TableHead>Passageiros</TableHead>
              <TableHead>Data do Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.email}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getDestinationName(lead.destination)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(lead.departureDate)}</TableCell>
                <TableCell>{formatPassengers(lead.passengers)}</TableCell>
                <TableCell>{lead.created_at ? formatDate(lead.created_at) : "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(lead)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Detalhes</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px]">
                      <SheetHeader>
                        <SheetTitle>Detalhes do Lead</SheetTitle>
                      </SheetHeader>
                      {selectedLead && (
                        <div className="py-6">
                          <dl className="space-y-4">
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Email:</dt>
                              <dd className="text-sm text-gray-900">{selectedLead.email}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Telefone:</dt>
                              <dd className="text-sm text-gray-900">{selectedLead.phone}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Origem:</dt>
                              <dd className="text-sm text-gray-900">
                                {selectedLead.origin === "BR" ? "Brasil" : "Estrangeiro vindo ao Brasil"}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Destino:</dt>
                              <dd className="text-sm text-gray-900">
                                {getDestinationName(selectedLead.destination)}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Data de Ida:</dt>
                              <dd className="text-sm text-gray-900">
                                {formatDate(selectedLead.departureDate)}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Data de Volta:</dt>
                              <dd className="text-sm text-gray-900">
                                {formatDate(selectedLead.returnDate)}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Passageiros:</dt>
                              <dd className="text-sm text-gray-900">
                                {formatPassengers(selectedLead.passengers)}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Idades:</dt>
                              <dd className="text-sm text-gray-900">
                                {selectedLead.passengers?.ages?.join(", ") || "N/A"}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Data de Cadastro:</dt>
                              <dd className="text-sm text-gray-900">
                                {selectedLead.created_at ? formatDate(selectedLead.created_at) : "N/A"}
                              </dd>
                            </div>
                          </dl>
                          
                          <div className="mt-6 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-2">
                                Notas sobre o Lead
                              </label>
                              <Textarea 
                                placeholder="Adicione observações sobre este lead..."
                                className="w-full"
                              />
                            </div>
                            <Button className="w-full" variant="default">
                              Marcar como Contatado
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
    </div>
  );
};

export default LeadsTable;
