
import { supabase } from "@/integrations/supabase/client";
import { Agency, AgencyTableData } from "@/services/api/types/agency";

// Functions to interact with agencies table using raw SQL queries
export async function getAgencyByUserId(userId: string): Promise<Agency | null> {
  try {
    // Use a direct cast to any to bypass type checking for the RPC call
    const result = await (supabase as any).rpc('get_agency_by_user_id', { 
      p_user_id: userId 
    });
    
    const { data, error } = result;

    if (error || !data) {
      console.error("Error fetching agency:", error);
      return null;
    }
    
    return data as Agency;
  } catch (error) {
    console.error("Exception when fetching agency:", error);
    return null;
  }
}

export async function getAgencyByEmail(email: string): Promise<Agency | null> {
  try {
    // Use a direct cast to any to bypass type checking for the RPC call
    const result = await (supabase as any).rpc('get_agency_by_email', { 
      p_email: email 
    });
    
    const { data, error } = result;
    
    if (error || !data) {
      console.error("Error fetching agency by email:", error);
      return null;
    }
    
    return data as Agency;
  } catch (error) {
    console.error("Exception when fetching agency by email:", error);
    return null;
  }
}

export async function createAgency(
  userId: string, 
  name: string,
  cnpj: string,
  responsibleName: string,
  email: string,
  phone: string,
  commissionRate: number,
  status: 'active' | 'pending' | 'inactive' = 'pending'
): Promise<{ success: boolean; error?: any }> {
  try {
    // Use a direct cast to any to bypass type checking for the RPC call
    const result = await (supabase as any).rpc('create_agency', {
      p_user_id: userId,
      p_name: name,
      p_cnpj: cnpj,
      p_responsible_name: responsibleName,
      p_email: email,
      p_phone: phone,
      p_commission_rate: commissionRate,
      p_status: status
    });
    
    const { error } = result;
    
    if (error) {
      console.error("Error creating agency:", error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Exception when creating agency:", error);
    return { success: false, error };
  }
}
