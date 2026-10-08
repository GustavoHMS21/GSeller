import { Delta } from "@/components/ui/delta";
import { Formula } from "@/components/ui/formula";

/** Título · valor · variação · período comparado · fórmula (Bloco 16.6). */
export function KpiCard({
  title,
  value,
  delta,
  deltaKind = "pct",
  goodWhen = "up",
  comparison,
  formula,
  note,
}: {
  title: string;
  value: string;
  delta: number | null;
  deltaKind?: "pct" | "pp";
  goodWhen?: "up" | "down";
  comparison: string;
  formula: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-4">
      <h3 className="text-sm font-medium text-fg-muted">{title}</h3>
      <p className="text-2xl font-semibold tabular-nums xl:text-highlight">{value}</p>
      <p className="flex flex-wrap items-baseline gap-x-1.5">
        <Delta value={delta} kind={deltaKind} goodWhen={goodWhen} />
        <span className="text-xs text-fg-muted">{comparison}</span>
      </p>
      {note && <p className="text-xs text-fg-muted">{note}</p>}
      <div className="mt-auto pt-2">
        <Formula>{formula}</Formula>
      </div>
    </div>
  );
}
