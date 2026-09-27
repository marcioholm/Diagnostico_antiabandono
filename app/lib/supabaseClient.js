import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nas env vars do projeto (.env.local localmente, ou Environment Variables na Vercel)."
  );
}

// Usa um placeholder válido quando as env vars não estão definidas — isso evita
// que o build inteiro quebre por falta de configuração (o supabase-js lança
// erro se a URL estiver vazia). Sem as env vars reais, o app roda normalmente,
// mas qualquer chamada ao Supabase falha em tempo de execução, não no build.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
