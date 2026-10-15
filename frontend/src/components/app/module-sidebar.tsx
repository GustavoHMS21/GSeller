import Link from "next/link";
import { cx } from "@/lib/cx";

export type ModuleSection = {
  title?: string;
  items: { href: string; label: string; count?: number }[];
};

/**
 * Lateral de um módulo (Pedidos, SAC, Produtos, Configurações), com contadores, como no
 * UpSeller (Bloco 60.9). No celular vira uma faixa horizontal acima do conteúdo.
 */
export function ModuleSidebar({
  title,
  sections,
  activeHref,
}: {
  title: string;
  sections: ModuleSection[];
  activeHref: string;
}) {
  return (
    <aside className="md:w-56 md:shrink-0">
      <nav
        aria-label={title}
        className="rounded-lg border border-line bg-surface p-3 md:sticky md:top-20"
      >
        <p className="mb-2 hidden px-2 text-lg font-semibold md:block">{title}</p>
        <ul className="flex gap-1 overflow-x-auto md:flex-col md:gap-0">
          {sections.map((section, i) => (
            <li key={section.title ?? i} className="contents md:block">
              {section.title && (
                <p className="mt-3 mb-1 hidden px-2 text-sm font-medium md:block">
                  {section.title}
                </p>
              )}
              <ul className="contents md:block">
                {section.items.map((item) => {
                  const active = item.href === activeHref;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cx(
                          "flex items-center justify-between gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm md:pl-5",
                          active
                            ? "bg-info-soft font-medium text-primary"
                            : "text-fg hover:bg-surface-muted",
                        )}
                      >
                        {item.label}
                        {item.count !== undefined && (
                          <span className="tabular-nums text-fg-muted">{item.count}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

// Laterais fixas dos módulos sem contadores.
export const PRODUCTS_NAV: ModuleSection[] = [
  {
    title: "Gerenciamento de Produtos",
    items: [
      { href: "/produtos", label: "Lista de Produtos" },
      { href: "/custos", label: "Custos" },
      { href: "/produtos/mapeamento", label: "Mapeamento de SKU" },
    ],
  },
];

export const SETTINGS_NAV: ModuleSection[] = [
  {
    items: [{ href: "/conexoes", label: "Integrações de Loja" }],
  },
];

/** Página de módulo: lateral à esquerda e conteúdo à direita. */
export function ModuleLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      {sidebar}
      <div className="min-w-0 flex-1 space-y-6">{children}</div>
    </div>
  );
}
