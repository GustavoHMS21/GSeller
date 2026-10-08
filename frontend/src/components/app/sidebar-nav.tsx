"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";

const ITEMS = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/produtos", label: "Produtos" },
  { href: "/custos", label: "Custos" },
  { href: "/conexoes", label: "Conexões" },
] as const;

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal">
      <ul className="flex gap-1 overflow-x-auto md:flex-col">
        {ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium",
                  active ? "bg-surface-muted text-fg" : "text-fg-muted hover:bg-surface-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
