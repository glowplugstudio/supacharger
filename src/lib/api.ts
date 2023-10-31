import { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchUserProfile = async (
  supabaseClient: SupabaseClient<Database>,
): Promise<Database["public"]["Tables"]["profiles"]["Row"]> => {
  // we don't need a where clause thanks to RLS
  const { data, error } = await supabaseClient
    .from("profiles")
    .select()
    .single();

  if (error) {
    console.error("[fetchUserProfile] error:", error);
    throw error;
  }

  return data;
};

export const fetchIsUserSuspended = async (
  supabaseClient: SupabaseClient<Database>,
): Promise<boolean> => {
  const userProfile = await fetchUserProfile(supabaseClient);

  return userProfile.profile_is_suspended;
};
