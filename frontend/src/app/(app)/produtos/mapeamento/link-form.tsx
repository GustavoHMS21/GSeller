"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Vínculo manual de um anúncio a um produto. Na demonstração, o vínculo não é salvo. */
export function LinkForm({ products }: { products: { id: string; label: string }[] }) {
  const [productId, setProductId] = useState("");
  const [linked, setLinked] = useState<string | null>(null);

  if (linked) {
    return (
      <p role="status" className="text-sm text-success">
        Vinculado a {linked}. O lucro entra na próxima sincronização.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setLinked(products.find((p) => p.id === productId)?.label ?? null);
      }}
      className="mt-2 flex flex-wrap gap-2"
    >
      <label>
        <span className="sr-only">Produto</span>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm text-fg"
        >
          <option value="">Escolha o produto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" variant="secondary" disabled={!productId}>
        Vincular
      </Button>
    </form>
  );
}
