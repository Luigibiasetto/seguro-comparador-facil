
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AbandonedCart, CustomerInfo, InsuranceOffer, InsuranceProvider, SearchParams } from "./api/types";

// Salvar um carrinho abandonado
export const saveAbandonedCart = async (
  searchParams: SearchParams,
  customerInfo?: CustomerInfo,
  offer?: InsuranceOffer,
  provider?: InsuranceProvider
): Promise<boolean> => {
  try {
    // Verificar se já existe um carrinho abandonado com o mesmo email e não finalizado
    const { data: existingCarts } = await supabase
      .from('abandoned_carts')
      .select('id')
      .eq('email', searchParams.email)
      .eq('phone', searchParams.phone)
      .eq('recovered', false)
      .order('created_at', { ascending: false })
      .limit(1);

    // Se já existir um carrinho, atualiza em vez de criar um novo
    if (existingCarts && existingCarts.length > 0) {
      const cartId = existingCarts[0].id;
      
      const cartData = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departureDate,
        return_date: searchParams.returnDate,
        passengers: searchParams.passengers,
      };

      if (customerInfo) cartData['customer_info'] = customerInfo;
      if (offer) cartData['offer_data'] = offer;
      if (provider) cartData['provider_data'] = provider;

      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        cartData['user_id'] = session.user.id;
      }

      const { error } = await supabase
        .from('abandoned_carts')
        .update(cartData)
        .eq('id', cartId);

      if (error) {
        console.error("Erro ao atualizar carrinho abandonado:", error);
        return false;
      }
      
      console.log("Carrinho abandonado atualizado com sucesso");
      return true;
    } else {
      // Criação de um novo carrinho abandonado
      const cartData = {
        email: searchParams.email,
        phone: searchParams.phone,
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departureDate,
        return_date: searchParams.returnDate,
        passengers: searchParams.passengers,
        recovered: false
      };

      if (customerInfo) cartData['customer_info'] = customerInfo;
      if (offer) cartData['offer_data'] = offer;
      if (provider) cartData['provider_data'] = provider;

      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        cartData['user_id'] = session.user.id;
      }

      const { error } = await supabase
        .from('abandoned_carts')
        .insert([cartData]);

      if (error) {
        console.error("Erro ao salvar carrinho abandonado:", error);
        return false;
      }
      
      console.log("Carrinho abandonado salvo com sucesso");
      return true;
    }
  } catch (error) {
    console.error("Erro inesperado ao processar carrinho abandonado:", error);
    return false;
  }
};

// Buscar todos os carrinhos abandonados (apenas para administradores)
export const getAbandonedCarts = async (): Promise<AbandonedCart[]> => {
  try {
    const { data, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar carrinhos abandonados:", error);
      toast.error("Erro ao carregar carrinhos abandonados");
      return [];
    }

    // Transformar os dados do Supabase para o formato esperado pelo frontend
    const formattedData: AbandonedCart[] = data.map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      email: item.email,
      phone: item.phone,
      origin: item.origin,
      destination: item.destination,
      departure_date: item.departure_date,
      return_date: item.return_date,
      passengers: typeof item.passengers === 'string' 
        ? JSON.parse(item.passengers) 
        : item.passengers,
      customer_info: item.customer_info,
      offer_data: item.offer_data,
      provider_data: item.provider_data,
      created_at: item.created_at,
      updated_at: item.updated_at,
      recovered: item.recovered
    }));

    return formattedData;
  } catch (error) {
    console.error("Erro inesperado:", error);
    toast.error("Erro ao carregar dados");
    return [];
  }
};

// Marcar um carrinho como recuperado
export const markCartAsRecovered = async (cartId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('abandoned_carts')
      .update({ recovered: true })
      .eq('id', cartId);

    if (error) {
      console.error("Erro ao atualizar status do carrinho:", error);
      toast.error("Erro ao atualizar status do carrinho");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro inesperado:", error);
    toast.error("Erro ao atualizar dados");
    return false;
  }
};

// Excluir um carrinho abandonado
export const deleteAbandonedCart = async (cartId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('abandoned_carts')
      .delete()
      .eq('id', cartId);

    if (error) {
      console.error("Erro ao excluir carrinho abandonado:", error);
      toast.error("Erro ao excluir carrinho abandonado");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro inesperado:", error);
    toast.error("Erro ao excluir dados");
    return false;
  }
};
