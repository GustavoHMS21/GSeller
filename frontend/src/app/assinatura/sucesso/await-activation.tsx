"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 15;

/** Recarrega o status no servidor a cada 2 s, por até 30 s (Bloco 54.2: progresso com texto). */
export function AwaitActivation() {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const waiting = attempts < MAX_ATTEMPTS;

  useEffect(() => {
    if (!waiting) return;
    const timer = setTimeout(() => {
      setAttempts((n) => n + 1);
      router.refresh();
    }, INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [waiting, router]);

  return (
    <div role="status" aria-live="polite">
      <h1 className="text-xl font-semibold">
        {waiting ? "Confirmando seu pagamento" : "Pagamento em processamento"}
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        {waiting
          ? "O Stripe está confirmando o pagamento. Isso costuma levar poucos segundos."
          : "A confirmação está demorando mais que o normal. O acesso é liberado automaticamente assim que o pagamento for confirmado; você pode fechar esta página."}
      </p>
      {waiting && <div className="progress-indeterminate mt-6" aria-hidden="true" />}
    </div>
  );
}
