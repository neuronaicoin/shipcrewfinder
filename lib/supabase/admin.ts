import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service role client — RLS kurallarını atlar.
 * SADECE server-side kodda kullanılmalı (server action, server component).
 * Asla client component'e import edilmemeli.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase admin client: NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY tanımlı değil."
    );
  }

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
