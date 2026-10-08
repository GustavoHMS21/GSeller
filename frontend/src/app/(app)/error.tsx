"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <ErrorState
      description="Tivemos um problema ao montar esta tela. Seus dados não foram alterados."
      action={<Button onClick={() => retry()}>Tentar novamente</Button>}
    />
  );
}
