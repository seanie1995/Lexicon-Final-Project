"use server";

import { createClient } from "@supabase-lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    email: user.email,
    displayName: user.user_metadata?.display_name || user.email,
  };
}
