// Empresas (CNPJ) e lojas (Bloco 60, issue #49): rótulos e formatação.

import type { TaxRegime } from "@/lib/api";
import type { Marketplace } from "@/lib/types";

export const TAX_REGIMES: { value: TaxRegime; label: string }[] = [
  { value: "simples_nacional", label: "Simples Nacional" },
  { value: "mei", label: "MEI" },
  { value: "lucro_presumido", label: "Lucro Presumido" },
  { value: "lucro_real", label: "Lucro Real" },
];

export const MARKETPLACES: { value: Marketplace; label: string }[] = [
  { value: "mercadolivre", label: "Mercado Livre" },
  { value: "shopee", label: "Shopee" },
];

export const taxRegimeLabel = (regime: TaxRegime) =>
  TAX_REGIMES.find((r) => r.value === regime)?.label ?? regime;

/** 14 caracteres → 12.ABC.345/01DE-35 (vale também para o CNPJ alfanumérico). */
export const formatCnpj = (cnpj: string) =>
  cnpj.replace(/^(.{2})(.{3})(.{3})(.{4})(.{2})$/, "$1.$2.$3/$4-$5");
