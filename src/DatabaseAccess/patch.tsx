import { RallyObject } from "../Types";
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
    .eq('id', id);

    if(error)
        throw error;

    return true;
}
