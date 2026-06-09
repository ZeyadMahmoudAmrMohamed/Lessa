import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../lib/env.js';

// Service-role client — bypasses RLS intentionally.
// Authorization is enforced by API middleware before any DB call reaches here.
let _client: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
  if (!_client) {
    _client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return _client;
}
