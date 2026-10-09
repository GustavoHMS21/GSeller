import type { Marketplace } from "@/lib/types";

const META: Record<Marketplace, { label: string; dot: string }> = {
  mercadolivre: { label: "Mercado Livre", dot: "bg-brand-ml ring-1 ring-black/20" },
  shopee: { label: "Shopee", dot: "bg-brand-shopee" },
};

export function MarketplaceBadge({ marketplace }: { marketplace: Marketplace }) {
  const { label, dot } = META[marketplace];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm">
      <span aria-hidden="true" className={`size-2.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
