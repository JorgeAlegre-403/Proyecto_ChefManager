import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey: string = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Cliente con service_role key — solo para operaciones admin en el servidor/frontend interno.
// ⚠️ Nunca exponer este cliente en apps públicas.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
