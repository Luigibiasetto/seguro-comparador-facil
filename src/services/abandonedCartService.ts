
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
      
      const cartData: Partial<AbandonedCart> = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departureDate,
        return_date: searchParams.returnDate,
        passengers: searchParams.passengers,
        updated_at: new Date().toISOString()
      };

      if (customerInfo) cartData.customer_info = customerInfo;
      if (offer) cartData.offer_data = offer;
      if (provider) cartData.provider_data = provider;

      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        cartData.user_id = session.user.id;
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
      const cartData: Omit<AbandonedCart, 'id' | 'created_at'> = {
        email: searchParams.email,
        phone: searchParams.phone,
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departureDate,
        return_date: searchParams.returnDate,
        passengers: searchParams.passengers,
        recovered: false
      };

      if (customerInfo) cartData.customer_info = customerInfo;
      if (offer) cartData.offer_data = offer;
      if (provider) cartData.provider_data = provider;

      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        cartData.user_id = session.user.id;
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

    return data || [];
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
