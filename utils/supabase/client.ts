import { getSupabaseConfig } from '@/utils/supabase/config';
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
