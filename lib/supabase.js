import { createClient } from "@supabase/supabase-js";

// Public keys (available on client if prefixed with NEXT_PUBLIC_)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Private keys (Server only)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Client-side / Public Supabase client (Anon Key)
 * SAFE for browser use.
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side / Admin Supabase client (Service Role Key)
 * SERVER ONLY. Bypasses RLS.
 */
export const supabase =
  typeof window === "undefined" && supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
        },
      })
    : supabaseClient; // Fallback to anon client if service key missing (e.g. on client)
