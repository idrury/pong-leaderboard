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
