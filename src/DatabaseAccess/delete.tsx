import { supabase } from "./SupabaseClient";

export async function deleteRally(rallyId: number) {
  const { error } = await supabase
    .from("rallys")
    .delete()
    .eq("id", rallyId);

  if (error) throw error;

  return true;
}

/***********************************
 * Remove a rally type from an event
 * @param eventId
 * @param typeId
 * @returns
 */
export async function deleteEventRallyType(
  eventId: string,
  typeId: number
) {
  const { error } = await supabase
    .from("campaigns_to_rally_types")
    .delete()
    .eq("rally_type_id", typeId)
    .eq("event_id", eventId);

  if (error) throw error;

  return true;
}

/*************************************
 * Delete user from org admins list
 * @param orgId
 * @param userId
 * @returns
 */
export async function deleteUserAdmin(orgId: number, userId: string) {
  const { data, error } = await supabase
    .from("users_to_orgs")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userId);

  if (error) throw error;

  return data;
}
