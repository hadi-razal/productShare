import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rrxbubfaouwutbyoymzv.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseBrowserConfigured = () =>
  Boolean(supabaseAnonKey) && !supabaseUrl.includes("placeholder.supabase.co");

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || "missing-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
