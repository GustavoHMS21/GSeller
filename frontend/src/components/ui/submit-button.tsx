"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

/** Botão de envio com estado pending (Bloco 54.2): rótulo muda e evita duplo envio. */
export function SubmitButton({
  children,
  pendingLabel,
  variant,
  name,
  value,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  variant?: "primary" | "secondary" | "ghost";
  name?: string;
  value?: string;
}) {
  const { pending, data } = useFormStatus();
  // Com dois botões no mesmo formulário, só o que foi clicado mostra o estado de envio.
  const isThis = pending && (!name || data?.get(name) === value);
  return (
    <Button
      type="submit"
      variant={variant}
      name={name}
      value={value}
      disabled={pending}
      aria-busy={isThis}
      className="w-full"
    >
      {isThis ? pendingLabel : children}
    </Button>
  );
}
