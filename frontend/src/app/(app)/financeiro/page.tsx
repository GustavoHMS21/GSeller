import type { Metadata } from "next";
import { DEMO, fixedCosts, PERIODS, storeSummary } from "@/lib/demo/data";
import { StoreProfit } from "./store-profit";

export const metadata: Metadata = { title: "Lucro da Loja" };

export default function FinancePage() {
  const store = storeSummary();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Lucro da Loja</h1>
        <p className="mt-1 text-sm text-fg-muted">
          {DEMO.periodLabel}. O lucro dos produtos considera só os que têm custo cadastrado.
        </p>
      </div>
      <StoreProfit
        initialCosts={fixedCosts}
        current={{
          period: PERIODS.current,
          revenue: store.revenue.current.revenue,
          productsProfit: store.result.current.result,
        }}
        previous={{
          period: PERIODS.previous,
          revenue: store.revenue.previous.revenue,
          productsProfit: store.result.previous.result,
        }}
      />
      <p className="text-xs text-fg-muted">
        Protótipo: os custos lançados ficam apenas nesta tela e não são salvos.
      </p>
    </div>
  );
}
