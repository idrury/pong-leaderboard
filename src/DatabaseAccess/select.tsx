import type { PeopleObject, RallyObject, RallyTypeObject } from "../Types";
import { supabase } from "./SupabaseClient";

/**************************************
 * Fetch all rallies from the database
 */
export async function fetchRallies(): Promise<RallyObject[]> {

    const {data, error} = await supabase.from("rallys").select();

    if(error) {
      alert(error.message);
      throw error;
    }

    return data;


}



/**************************************
 * Fetch all rally types from the database
 */
export async function fetchRallyTypes(): Promise<RallyTypeObject[]> {

    const {data, error} = await supabase.from("rally_types").select();

    if(error) {
      alert(error.message);
      throw error;
    }

    return data;


}


/***************
 * 
 */
export async function fetchPeople(): Promise<PeopleObject[]> {

    const {data, error} = await supabase.from("people").select();

    if(error) {
      alert(error.message);
      throw error;
    }

    return data;
}