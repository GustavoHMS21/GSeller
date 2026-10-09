// Formatação pt-BR. Dinheiro sempre com contexto (Bloco 16.2): moeda, período e comparação.

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlRounded = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export const formatBRL = (value: number) => brl.format(value);
export const formatBRLRounded = (value: number) => brlRounded.format(value);
export const formatInt = (value: number) => integer.format(value);
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/** Razão (0.224) → "22,4%". */
export function formatPct(ratio: number, digits = 1): string {
  return `${(ratio * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

/** Variação relativa entre períodos. Null quando não há base de comparação. */
export function relativeChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return (current - previous) / Math.abs(previous);
}

/** Diferença entre duas razões em pontos percentuais: 0.021 → "2,1 p.p.". */
export function formatPP(delta: number): string {
  return `${Math.abs(delta * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} p.p.`;
}
