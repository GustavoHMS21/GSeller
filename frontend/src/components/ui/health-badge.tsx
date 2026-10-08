import { Badge, type Tone } from "@/components/ui/badge";
import type { HealthLevel } from "@/lib/types";

const LEVEL: Record<HealthLevel, { tone: Tone; icon: string; label: string }> = {
  healthy: { tone: "success", icon: "●", label: "Saudável" },
  attention: { tone: "warning", icon: "▲", label: "Atenção" },
  critical: { tone: "danger", icon: "■", label: "Crítico" },
  unknown: { tone: "neutral", icon: "○", label: "Sem dados" },
};

export function HealthBadge({ level, score }: { level: HealthLevel; score?: number | null }) {
  const { tone, icon, label } = LEVEL[level];
  return (
    <Badge tone={tone} icon={icon}>
      {label}
      {score !== undefined && score !== null && <span className="tabular-nums">· {score}</span>}
    </Badge>
  );
}
