import type {
  PeopleObject,
  RallyObject,
  RallyTypeObject,
} from "../Types";
import { supabase } from "./SupabaseClient";

/**************************************
 * Fetch all rallies from the database
 */
export async function fetchRallies (): Promise<RallyObject[]> {

  const { data, error } = await supabase.from("rallys").select();

  if (error) {
    alert(error.message);
    throw error;
  }
  console.log("Fetched rallies:", data);

  return data;


}

/**************************************
 * Fetch all rally types from the database
 */
export async function fetchRallyTypes (): Promise<RallyTypeObject[]> {

  const { data, error } = await supabase.from("rally_types").select();

  if (error) {
    alert(error.message);
    throw error;
  }

  return data;


}

/***************
 *
 */
export async function fetchPeople (): Promise<PeopleObject[]> {

  const { data, error } = await supabase.from("people").select();

  if (error) {
    alert(error.message);
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
  age: number
): Promise<boolean> {
  const { error } = await supabase
    .from("people")
    .insert({ name: name, age: age });

  if (error) {
    throw error;
  }

  return true;
}

/********************************
 * Insert a new rally
 * @param hits The number of hits of the rally
 * @param people_ids The ids of people to add
 * @param rallyTypeId The id of the rally type
 * @returns True if successful
 * @throws Error if fails
 */
export async function insertRally(
  hits: string,
  people_ids: number,
  rallyTypeId: number
): Promise<boolean> {
  const { error } = await supabase
    .from("people")
    .insert({ hits: hits, people_ids: people_ids, rally_type: rallyTypeId });

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
  tags: number
): Promise<boolean> {
  const { error } = await supabase
    .from("people")
    .insert({ name: name, tags: tags });

  if (error) {
    throw error;
  }

  return true;
}
