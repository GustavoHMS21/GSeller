import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const MENU_PANEL =
  "absolute top-full right-0 z-50 mt-1 w-64 rounded-md border border-line bg-surface p-2 text-sm text-fg shadow-lg";
const MENU_ITEM = "block rounded px-3 py-2 hover:bg-surface-muted";

/** Engrenagem: configurações, como no UpSeller (Bloco 60.9). */
export function SettingsMenu() {
  return (
    <details className="relative">
      <summary
        aria-label="Configurações"
        className="flex cursor-pointer list-none items-center rounded p-2 text-nav-fg-muted hover:text-nav-fg"
      >
        <GearIcon />
      </summary>
      <div className={MENU_PANEL}>
        <Link href="/conexoes" className={MENU_ITEM}>
          Integrações de Loja
        </Link>
        <Link href="/sobre" className={MENU_ITEM}>
          Sobre o projeto
        </Link>
      </div>
    </details>
  );
}

/** Protótipo de portfólio (Bloco 60.10): sem conta, só dados fictícios. */
export function PrototypeBadge() {
  return (
    <Link href="/sobre" className="flex items-center gap-3 text-sm">
      <Badge tone="info" icon="●">
        Protótipo · dados fictícios
      </Badge>
    </Link>
  );
}

function GearIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}
