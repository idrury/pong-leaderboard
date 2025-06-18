import { supabase } from "./SupabaseClient";

export async function deleteRally(rallyId: number) {
  const { error } = await supabase
    .from("rallys")
    .delete()
    .eq("id", rallyId);

  if (error) throw error;

  return true;
}
