import type {
  CampaignRallyTypeObject,
  ProfileObject,
  RallyObject,
} from "../Types";
import { supabase } from "./SupabaseClient";

/**************************************
 * Fetch all rallies from the database
 */
export async function fetchRallies(
  eventId: string
): Promise<RallyObject[]> {
  const { data, error } = await supabase
    .from("rallys")
    .select("*, profiles(*)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error(error.message);
    throw error;
  }

  return data;
}

/*********************************************************
 * Fetch the rally types for a campaign with the campaign records
 * @param campaignId The id of the campaign to get
 */
export async function fetchRallyTypes(
  eventId: string
): Promise<CampaignRallyTypeObject[]> {
  const { data, error } = await supabase
    .from("campaigns_to_rally_types")
    .select(
      "rally_types(*), rallys!campaigns_to_rally_types_high_score_id_fkey(id, created_at, num_hits, is_high_score, profiles(*))"
    )
    .eq("event_id", eventId);

  if (error) {
    console.error(error.message);
    throw error;
  }

  console.log(data);

  /*@ts-ignore */
  return data;
}

/***************
 *
 */
export async function fetchProfiles(): Promise<ProfileObject[]> {
  const { data, error } = await supabase.from("profiles").select();

  if (error) {
    console.error(error.message);
    throw error;
  }

  return data;
}

export async function fetchEvent(code: string) {
  const { data, error } = await supabase
    .from("events")
    .select()
    .eq("id", code)
    .single();

  if (error) throw error;

  return data;
}

/*****************************************
 * Insert a new person
 * @param name The name of the person
 * @param age The age of the person
 * @returns A boolean if successful
 * @thorws Error if unsuccessful
 */
export async function insertPerson(
  name: string,
  age?: number
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .insert({ name: name, age: age || null });

  if (error) {
    throw error;
  }

  return true;
}

/********************************
 * Insert a new rally
 * @param hits The number of hits of the rally
 * @param people_id The ids of people to add
 * @param rallyType The name of the rally type
 * @returns True if successful
 * @throws Error if fails
 */
export async function insertRally(
  hits: number,
  profileId: string,
  rallyType: number,
  highScore: boolean = false
): Promise<boolean> {
  const { error } = await supabase.from("rallys").insert({
    num_hits: hits,
    profiles: profileId,
    rally_type_id: rallyType,
    is_high_score: highScore,
  });

  if (error) {
    throw error;
  }

  return true;
}

/*************************
 * Add a new rally type
 * @param name The name of the rally type
 * @param tags The tags of the rally type
 * @returns True if sucessful
 * @throws Error if fails
 */
export async function insertRallyType(
  name: string,
  tags?: string[]
): Promise<boolean> {
  const { error } = await supabase
    .from("rally_types")
    .insert({ name: name, tags: tags });

  if (error) {
    throw error;
  }

  return true;
}

/************************************
 * Upsert a user profile
 * @param name The name of the user
 * @param email The email of the user
 * @returns True if successful
 * @throws Error if fails
 */
export async function upsertProfile(name: string, email: string) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ name: name, email: email });

  if (error) throw error.message;

  return true;
}

export async function fetchProfile(
  userId: string | undefined
): Promise<ProfileObject | null> {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function searchUser(
  name: string | undefined
): Promise<ProfileObject | undefined> {
  if (!name) return;

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("name", name)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
