"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Uma tentativa por carregamento de página, mesmo com efeitos executados duas vezes.
let starting: Promise<boolean> | null = null;

/**
 * Primeiro acesso sem sessão: cria a sessão anônima do modo demonstração, que marca o
 * início do trial (issue #33). Roda no navegador, então robôs que não executam JS não criam contas.
 */
export function DemoSession() {
  const router = useRouter();
  useEffect(() => {
    starting ??= createClient()
      .auth.signInAnonymously()
      .then(({ error }) => !error);
    starting.then((ok) => {
      if (ok) router.refresh();
    });
  }, [router]);
  return null;
}
