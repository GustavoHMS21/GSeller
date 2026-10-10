import Link from "next/link";
import { ConnectionStatusBadge } from "@/components/app/connection-status";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { connections, DEMO } from "@/lib/demo/data";
import { formatDateTime } from "@/lib/format";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Pular para o conteúdo
      </a>

      <div role="note" className="bg-info-soft px-4 py-2 text-center text-sm text-info">
        Protótipo com <strong>dados de demonstração</strong> de uma loja fictícia. Nenhum dado real.
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="border-b border-line bg-surface px-4 py-4 md:w-56 md:shrink-0 md:border-b-0 md:border-r">
          <Link href="/dashboard" className="mb-4 block text-lg font-bold tracking-tight">
            GSeller
          </Link>
          <SidebarNav />
          <Link href="/design" className="mt-6 hidden text-xs text-fg-muted hover:text-fg md:block">
            Design System v0.1
          </Link>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line bg-surface px-6 py-3 text-sm">
            <div>
              <span className="font-medium">{DEMO.storeName}</span>
              <span className="text-fg-muted">
                {" "}
                · {DEMO.periodLabel} {DEMO.comparisonLabel}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:ml-auto">
              {connections.map((c) => (
                <span key={c.marketplace} className="inline-flex items-center gap-2">
                  <MarketplaceBadge marketplace={c.marketplace} />
                  <ConnectionStatusBadge status={c.status} />
                </span>
              ))}
              <span className="text-fg-muted">
                Última sincronização: {formatDateTime(DEMO.lastSyncAt)}
              </span>
            </div>
          </header>

          <main id="conteudo" className="flex-1 px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
