// Configuração pública do Supabase (URL e publishable key). Nenhum segredo aqui.

export function supabaseUrl(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function supabaseKey(): string {
  return requireEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Variável de ambiente ausente: ${name}`);
  return value;
}
