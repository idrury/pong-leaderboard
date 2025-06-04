import { supabase } from "./SupabaseClient";

export async function checkPin(
  orgId = 1,
  pin: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc("check_pin", {
    org_id: orgId,
    pin: pin,
  });

  if (error) {
    throw error;
  }

  return data as boolean;
}
