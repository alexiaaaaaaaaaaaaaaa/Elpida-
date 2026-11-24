import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** false quando o arquivo .env ainda não foi preenchido. */
export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(url || 'http://localhost:54321', anonKey || 'sem-chave', {
  auth: { persistSession: true, autoRefreshToken: true },
});
