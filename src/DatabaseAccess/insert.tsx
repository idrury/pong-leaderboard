import { supabase } from "./SupabaseClient";

/*******************************************
 * Add an existing rally to a specific event
 * @param typeId The id of the rally type
 * @param eventId The id of the event
 */
export async function insertRallyTypeForEvent(
  typeId: number,
  eventId: string
) {
  const { data, error } = await supabase
    .from("campaigns_to_rally_types")
    .insert({ rally_type_id: typeId, event_id: eventId });
  if (error) throw error;

  return data;
}

/**********************************
 * Add a new admin to the organisation
 * @param orgId The organisations id
 * @param userId The id of the user to add to the organisation
 */
export async function insertUserAdmin(orgId: number, userId: string) {
  const { data, error } = await supabase
    .from("users_to_orgs")
    .insert({
      org_id: orgId,
      user_id: userId,
      profile_id: userId,
      is_admin: true,
    });

  if (error) throw error;

  return data;
}

/*************************************
 * Add a new rally type to the DB
 * @param name
 * @param description
 * @param min
 * @param max
 */
export async function insertNewRallyType(
  name: string,
  description: string,
  min: number,
  max: number
) {
  const { data, error } = await supabase
    .from("rally_types")
    .insert({
      name: name,
      description: description,
      min_people: min,
      max_people: max,
    })
    .select();

  if (error) throw error;

  return data;
}

/******************************************
 * Add a user to an organisation as a player
 * @param orgId The org to add them to
 * @param userId The user to add
 */
export async function insert_user_to_org(
  orgId: number,
  userId: string
) {
  const { data, error } = await supabase
    .from("users_to_orgs")
    .insert({ org_id: orgId, user_id: userId, profile_id: userId });

  if (error) throw error;

  return data;
}
