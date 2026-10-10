import { Delta } from "@/components/ui/delta";

/** Título · número · variação (Bloco 16.6, revisado na v0.16: sem fórmula na tela). */
export function KpiCard({
  title,
  value,
  delta,
  deltaKind = "pct",
  goodWhen = "up",
  note,
}: {
  title: string;
  value: string;
  delta: number | null;
  deltaKind?: "pct" | "pp";
  goodWhen?: "up" | "down";
  note?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-4">
      <h3 className="text-sm font-medium text-fg-muted">{title}</h3>
      <p className="text-2xl font-semibold tabular-nums xl:text-highlight">{value}</p>
      <Delta value={delta} kind={deltaKind} goodWhen={goodWhen} />
      {note && <p className="text-xs">{note}</p>}
    </div>
  );
}
