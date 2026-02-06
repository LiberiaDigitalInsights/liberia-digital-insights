import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
// Use Service Role Key for backend administration (bypasses RLS)
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    "[supabase] Missing SUPABASE_URL or SUPABASE_KEY in environment",
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
