import { supabase } from "./SupabaseClient";

export async function SignUpUser(
  email: string,
  password: string,
  name: string
) {
  const { data, error } =
    await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

  if (error) throw error.message;

  return data;
}

/***********************
 * Create a new profile not linked to a user
 * @param name The name of the profile to create
 */
export async function createAnonProfile(
  name: string
) {
  const { data, error } = await supabase
    .rpc("create_anon_user", { nm: name })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function signInUser(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

  if (error) throw error.message;

  return data;
}
