"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";

type NavItem = { href: string; label: string };
type NavModule = {
  label: string;
  href: string;
  /** Rotas que acendem o módulo. */
  match: string[];
  groups?: { title: string; items: NavItem[] }[];
};

// Módulos na ordem do UpSeller, para quem migra não se perder (Bloco 60.9). Só entram módulos
// que já funcionam: Estoque chega com a #53.
const MODULES: NavModule[] = [
  { label: "Início", href: "/dashboard", match: ["/dashboard"] },
  {
    label: "Produtos",
    href: "/produtos",
    match: ["/produtos", "/custos"],
    groups: [
      {
        title: "Gerenciamento de Produtos",
        items: [
          { href: "/produtos", label: "Lista de Produtos" },
          { href: "/custos", label: "Custos" },
          { href: "/produtos/mapeamento", label: "Mapeamento de SKU" },
        ],
      },
    ],
  },
  {
    label: "Pedidos",
    href: "/pedidos",
    match: ["/pedidos"],
    groups: [
      {
        title: "Gerenciamento de Pedidos",
        items: [
          { href: "/pedidos", label: "Todos os Pedidos" },
          { href: "/pedidos?filtro=emitir", label: "Para Emitir" },
          { href: "/pedidos?filtro=enviar", label: "Para Enviar" },
          { href: "/pedidos?filtro=atrasados", label: "Atrasados" },
        ],
      },
      {
        title: "Pós-venda",
        items: [
          { href: "/pedidos?filtro=reclamacao", label: "Reclamações" },
          { href: "/pedidos?filtro=devolvidos", label: "Devoluções" },
        ],
      },
    ],
  },
  {
    label: "SAC",
    href: "/atendimento",
    match: ["/atendimento"],
    groups: [
      {
        title: "Mercado Livre",
        items: [
          { href: "/atendimento?filtro=perguntas", label: "Perguntas" },
          { href: "/atendimento?filtro=pos-venda", label: "Mensagens pós-venda" },
          { href: "/atendimento?filtro=reclamacoes", label: "Reclamações" },
        ],
      },
    ],
  },
  {
    label: "Análises",
    href: "/analises",
    match: ["/analises"],
    groups: [
      {
        title: "Lucro",
        items: [
          { href: "/analises", label: "Lucro e alertas" },
          { href: "/analises#marketplaces", label: "Por marketplace" },
        ],
      },
    ],
  },
];

const isIn = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/** Módulos na barra escura; o submenu abre ao passar o mouse ou ao focar pelo teclado. */
export function TopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Módulos" className="min-w-0">
      <ul className="flex overflow-x-auto md:overflow-visible">
        {MODULES.map((module) => {
          const active = isIn(pathname, module.match);
          return (
            <li key={module.href} className="group relative">
              <Link
                href={module.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "block whitespace-nowrap px-4 py-3.5 text-[0.95rem] font-medium",
                  active ? "bg-nav-hover text-nav-fg" : "text-nav-fg-muted hover:text-nav-fg",
                )}
              >
                {module.label}
              </Link>
              {module.groups && (
                <div className="invisible absolute top-full left-0 z-40 hidden min-w-64 rounded-b-md border border-line bg-surface p-4 shadow-lg md:block group-focus-within:visible group-hover:visible">
                  <div className="flex gap-8">
                    {module.groups.map((group) => (
                      <div key={group.title}>
                        <p className="mb-2 border-l-2 border-primary pl-2 text-sm text-fg-muted">
                          {group.title}
                        </p>
                        <ul className="space-y-1">
                          {group.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className="block whitespace-nowrap rounded px-2 py-1.5 text-sm text-fg hover:bg-surface-muted hover:text-primary"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
