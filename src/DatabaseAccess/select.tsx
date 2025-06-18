import type {
  CampaignRallyTypeObject,
  EventObject,
  OrganisationObject,
  OrganisationSummaryObject,
  ProfileObject,
  UserRalliesObject,
} from "../Types";
import { supabase } from "./SupabaseClient";

/**************************************
 * Fetch all rallies from the database
 */
export async function fetchRallies(
  eventId: string
): Promise<UserRalliesObject[]> {
  const { data, error } = await supabase.rpc("get_user_rallies", {
    evt_id: eventId,
  });

  if (error) throw error;
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
    .eq("event_id", eventId)
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }

  /*@ts-ignore */
  return data;
}

/***************
 *
 */
export async function fetchProfiles(): Promise<ProfileObject[]> {
  const { data, error } = await supabase.from("profiles").select();

  if (error) {
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

/**********************************************
 * Fetch the events from the database for an organisation
 * @param orgId The organisation id to fetch events for
 */
export async function fetchEvents(
  orgId: number
): Promise<EventObject[]> {
  const { data, error } = await supabase
    .from("events")
    .select()
    .eq("org_id", orgId);

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
  rallyType: number,
  highScore: boolean = false,
  eventId: string
): Promise<number> {
  const { data, error } = await supabase
    .from("rallys")
    .insert({
      num_hits: hits,
      rally_type_id: rallyType,
      is_high_score: highScore,
      event_id: eventId,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

/**
 *
 * @param id
 * @param people
 * @returns
 */
export async function insertPeopleForRally(
  id: number,
  people: ProfileObject[],
  profile: ProfileObject
) {
  const values = new Array<{ rally_id: number; user_id: string }>();
  people.forEach((p) => values.push({ user_id: p.id, rally_id: id }));
  values.push({ user_id: profile.id, rally_id: id });

  const { error } = await supabase
    .from("users_to_rallys")
    .insert(values);

  if (error) throw error;

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

/***********************************
 * Check if a username is unique in the db
 * @param userName
 * @returns
 */
export async function fetchProfileByName(
  name: string
): Promise<ProfileObject | null> {
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

export async function fetchOrganisationFromEvent(eventId: string):Promise<OrganisationSummaryObject> {
  const { data, error } = await supabase.rpc(
    "get_organisation_from_event",
    { evt_id: eventId }
  ).select().single();

  if(error)
    throw error;

  return data;
}

/********************************
 * Fetch a users organisation
 * @param userId
 */
export async function fetchOrganisation(
  userId: string
): Promise<OrganisationObject> {
  const { data, error } = await supabase
    .from("organisations")
    .select()
    .eq("creator_id", userId)
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
