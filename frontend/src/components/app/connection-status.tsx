import { Badge, type Tone } from "@/components/ui/badge";
import type { ConnectionStatus } from "@/lib/types";

/** Estados de integração definidos na Tela 2 do Master Plan (Bloco 6). */
export const CONNECTION_STATUS: Record<
  ConnectionStatus,
  { tone: Tone; icon: string; label: string; help: string }
> = {
  connected: {
    tone: "success",
    icon: "●",
    label: "Conectado",
    help: "Dados sendo atualizados normalmente.",
  },
  syncing: {
    tone: "info",
    icon: "↻",
    label: "Sincronizando",
    help: "Importando produtos e pedidos. Pode levar alguns minutos.",
  },
  attention: {
    tone: "warning",
    icon: "▲",
    label: "Requer atenção",
    help: "Parte dos dados não pôde ser importada. Veja o detalhe.",
  },
  expired: {
    tone: "warning",
    icon: "⟳",
    label: "Autorização expirada",
    help: "O acesso foi revogado ou expirou. Reconecte para voltar a sincronizar.",
  },
  error: {
    tone: "danger",
    icon: "■",
    label: "Erro",
    help: "A sincronização falhou repetidamente. Nossa equipe foi avisada.",
  },
  disconnected: {
    tone: "neutral",
    icon: "○",
    label: "Desconectado",
    help: "Nenhum dado novo será importado.",
  },
};

export function ConnectionStatusBadge({ status }: { status: ConnectionStatus }) {
  const { tone, icon, label } = CONNECTION_STATUS[status];
  return (
    <Badge tone={tone} icon={icon}>
      {label}
    </Badge>
  );
}
