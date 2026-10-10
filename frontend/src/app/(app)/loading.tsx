import { Skeleton } from "@/components/ui/states";

export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Carregando…</span>
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {["receita", "resultado", "margem", "pedidos", "ticket"].map((kpi) => (
          <Skeleton key={kpi} className="h-36" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
