import { UUID } from "crypto";
import type {
  CampaignRallyTypeObject,
  EventObject,
  OrganisationObject,
  OrganisationSummaryObject,
  playerOrgObject,
  ProfileObject,
  UserAdminOrgsObject,
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
console.log("D", data)
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
    .rpc("get_rally_types", { evt_id: eventId })
    .select();

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
  people: playerOrgObject[],
  orgId: number
) {
  const values = new Array<{ rally_id: number; player_id: string }>();
  people.forEach((p) => values.push({ player_id: p.player_id, rally_id: id }));
  console.log(people)
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
    .eq("lower_name", name.toLowerCase())
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchOrganisationFromEvent(
  eventId: string
): Promise<OrganisationSummaryObject> {
  const { data, error } = await supabase
    .rpc("get_organisation_from_event", { evt_id: eventId })
    .select()
    .single();

  if (error) throw error;

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

/********************************
 * Fetch a users organisation
 * @param userId
 */
export async function fetchUsersOrganisations(
  userId: string
): Promise<UserAdminOrgsObject[]> {
  const { data, error } = await supabase
    .rpc("fetch_user_admin_orgs", { uid: userId })
    .select();

  if (error) {
    throw error;
  }

  return data;
}

/*******************************************
 * Get the profiles of admins of the organisation
 * @param orgId Organisations ID
 */
export async function fetchOrgAdmins(orgId: number): Promise<any> {
  const { data, error } = await supabase
    .from("users_to_orgs")
    .select("profiles(*)")
    .eq("org_id", orgId)
    .eq("is_admin", true);

  if (error) throw error;

  return data;
}

export async function fetchAllRallyTypes() {
  const { data, error } = await supabase.from("rally_types").select();

  if (error) {
    throw error;
  }

  return data;
}

/****************************************************
 * Get a list of users (limit 10) with a matching name
 * @param name The name to search for
 */
export async function fetchUsersByName(
  name: string,
  orgId: number
): Promise<playerOrgObject[]> {
  const { data, error } = await supabase.rpc("match_user_search", {
    nm: name,
    oid: orgId,
  });

  if (error) throw error;
  console.log(data);
  return data;
}

/****************************************************
 * Get a list of users (limit 10) with a matching name
 * @param name The name to search for
 */
export async function fetchPlayerByName(
  name: string,
  orgId: number
): Promise<playerOrgObject[]> {
  const { data, error } = await supabase.rpc("find_user_in_org", {
    nm: name,
    oid: orgId,
  });

  if (error) throw error;
  return data;
}


/*************************************
 * Check if a player exists in an organisation
 * @param orgId The organisation to check
 * @param playerId The id of the player
 * @returns True if exists, else false
 */
export async function checkPlayerInOrg(
  orgId: number,
  playerId: UUID
): Promise<boolean> {
  const { data, error } = await supabase
    .from("players_to_orgs")
    .select()
    .eq("org_id", orgId)
    .eq("profile_id", playerId)
    .maybeSingle();

  if (error) throw error;
  else if (data) return true;
  else return false;
}