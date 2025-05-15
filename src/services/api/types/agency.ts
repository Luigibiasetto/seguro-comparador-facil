
// Tipos para o sistema de agências

export interface Agency {
  id: string;
  user_id: string;
  name: string;
  cnpj: string;
  responsible_name: string;
  email: string;
  phone: string;
  commission_rate: number;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
}

export interface AgencySale {
  id: string;
  agency_id: string;
  customer_name: string;
  customer_email: string;
  customer_cpf: string;
  product_id: string;
  product_name: string;
  sale_date: string;
  departure_date: string;
  return_date: string;
  total_amount: number;
  commission_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface AgencyCommission {
  id: string;
  agency_id: string;
  sale_id: string;
  amount: number;
  status: 'pending' | 'paid';
  payment_date?: string;
}

// Definimos este tipo para ser usado com o SQL RAW quando
// a tabela 'agencies' ainda não existe na tipagem do Supabase
export interface AgencyTableData {
  id: string;
  user_id: string;
  name: string;
  cnpj: string;
  responsible_name: string;
  email: string;
  phone: string;
  commission_rate: number;
  status: string;
  created_at: string;
}
