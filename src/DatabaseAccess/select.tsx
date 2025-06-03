import { supabase } from "./SupabaseClient";

/**************************************
 * Fetch all rallies from the database
 */
export async function fetchRallies(): Promise<any> {

    const {data, error} = await supabase.from("rallys").select();

    if(error) {
      alert(error.message);
      throw error;
    }

    console.log("D", data);
    return data;


}



/**************************************
 * Fetch all rally types from the database
 */
export async function fetchRallyTypes(): Promise<any> {

    const {data, error} = await supabase.from("rally_types").select();

    if(error) {
      alert(error.message);
      throw error;
    }

    console.log("D", data);
    return data;


}


/***************
 * 
 */
export async function fetchPeople(): Promise<any> {

    const {data, error} = await supabase.from("people").select();

    if(error) {
      alert(error.message);
      throw error;
    }

    console.log("D", data);
    return data;


}