import { EventObject, RallyObject } from "../Types";
import { supabase } from "./SupabaseClient";

/**********************************
 * Update a specific rally attribute
 * @param id The id of the rally to update
 * @param attribute The attribute to update
 * @param value The value to update the attritbute to
 */
export async function patchRally(
  id: number,
  attribute: keyof RallyObject,
  value: any
) {
  const { error } = await supabase
    .from("rallys")
    .update({ [attribute]: value })
    .eq("id", id);

  if (error) throw error;

  return true;
}

export async function blockUser(orgId: number, userId: string) {
  const { data, error } = await supabase.rpc("block_user_from_org", {
    user_id: userId,
    org_id: orgId,
  });

  if(error)
    throw error;

  return data;
}

/**********************************
 * Update an attribute of an event
 * @param id The id of the event to update
 * @param attribute The attribute to change
 * @param value The value to change the attr to
 */
export async function patchEvent(
  id: string,
  attribute: keyof EventObject,
  value: any
) {

  const { error } = await supabase
    .from("events")
    .update({ [attribute]: value })
    .eq("id", id);

  if (error) throw error;

  return true;
}