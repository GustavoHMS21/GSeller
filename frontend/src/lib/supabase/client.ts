import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "@/lib/supabase/env";

/** Cliente do Supabase no navegador. Grava a sessão em cookies, lidos pelo servidor. */
export function createClient() {
  return createBrowserClient(supabaseUrl(), supabaseKey());
}
