import type {
  PeopleObject,
  RallyObject,
  RallyTypeObject,
} from "../Types";
import { supabase } from "./SupabaseClient";

/**************************************
 * Fetch all rallies from the database
 */
export async function fetchRallies(): Promise<
  RallyObject[]
> {
  const { data, error } = await supabase
    .from("rallys")
    .select("*, people(*)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error(error.message);
    throw error;
  }

  return data;
}

/**************************************
 * Fetch all rally types from the database
 */
export async function fetchRallyTypes(): Promise<
  RallyTypeObject[]
> {
  const { data, error } = await supabase
    .from("rally_types")
    .select();

  if (error) {
     console.error(error.message);
    throw error;
  }

  return data;
}

/***************
 *
 */
export async function fetchPeople(): Promise<
  PeopleObject[]
> {
  const { data, error } = await supabase
    .from("people")
    .select();

  if (error) {
    console.error(error.message);
    throw error;
  }

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
    .from("people")
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
  peopleId: number,
  rallyType: string
): Promise<boolean> {
  const { error } = await supabase
    .from("rallys")
    .insert({
      num_hits: hits,
      people: peopleId,
      rally_type: rallyType,
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
