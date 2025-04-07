// // lib/supabase.ts
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Kiểm tra biến môi trường từ build time
const assertEnv = (env: string | undefined, name: string): string => {
  if (!env) throw new Error(`Missing ${name} environment variable`);
  return env;
};

export const supabase = createClient(
  assertEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
  assertEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
);