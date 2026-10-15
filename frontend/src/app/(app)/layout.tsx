import Link from "next/link";
import { PrototypeBadge, SettingsMenu } from "@/components/app/account-bar";
import { TopNav } from "@/components/app/top-nav";

/** Barra superior de módulos, como no UpSeller (Bloco 60.9); cada módulo tem a lateral própria. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Pular para o conteúdo
      </a>

      <header className="sticky top-0 z-30 bg-nav text-nav-fg">
        <div className="flex items-center gap-2 px-4">
          <Link href="/dashboard" className="mr-4 shrink-0 text-lg font-bold tracking-tight">
            GSeller
          </Link>
          <TopNav />
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <SettingsMenu />
            <PrototypeBadge />
          </div>
        </div>
      </header>

      <div role="note" className="bg-info-soft px-4 py-2 text-center text-sm text-info">
        Protótipo de portfólio com dados fictícios de uma loja. Nada do que você mudar é salvo.{" "}
        <Link href="/sobre" className="font-medium underline">
          Sobre o projeto
        </Link>
      </div>

      <main id="conteudo" className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-6">
        {children}
      </main>
    </div>
  );
}
