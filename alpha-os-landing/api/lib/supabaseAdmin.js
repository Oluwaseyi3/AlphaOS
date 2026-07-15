import { createClient } from '@supabase/supabase-js'

// Server-only client: uses the service_role key so RLS is bypassed for the
// staking mutations that live behind these API routes. Never import this
// file from client (src/) code - SUPABASE_SERVICE_ROLE_KEY must not ship
// to the browser.
const url = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('[supabaseAdmin] Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createClient(url, serviceKey)
