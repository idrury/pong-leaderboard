import { supabase } from "./SupabaseClient";

export async function SignUpUser(
  email: string,
  password: string,
  name: string
) {
  console.log(email, password);
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
