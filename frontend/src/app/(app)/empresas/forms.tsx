"use client";

import { useActionState } from "react";
import { createCompany, createStore, type FormState } from "@/app/(app)/empresas/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { MARKETPLACES, TAX_REGIMES } from "@/lib/business";

const INPUT =
  "w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted";

function FormError({ state }: { state: FormState }) {
  return state.error ? (
    <p role="alert" className="rounded-md bg-danger-soft p-3 text-sm text-danger sm:col-span-full">
      {state.error}
    </p>
  ) : null;
}

export function CompanyForm() {
  const [state, action] = useActionState<FormState, FormData>(createCompany, {});
  const v = state.values ?? {};
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[1fr_2fr_1fr_auto] sm:items-end">
      <label className="space-y-1 text-sm font-medium">
        <span>CNPJ</span>
        <input
          name="cnpj"
          required
          maxLength={18}
          defaultValue={v.cnpj}
          placeholder="00.000.000/0000-00"
          autoComplete="off"
          className={INPUT}
        />
      </label>
      <label className="space-y-1 text-sm font-medium">
        <span>Razão social</span>
        <input
          name="legal_name"
          required
          minLength={2}
          maxLength={150}
          defaultValue={v.legal_name}
          className={INPUT}
        />
      </label>
      <label className="space-y-1 text-sm font-medium">
        <span>Regime tributário</span>
        <select
          name="tax_regime"
          defaultValue={v.tax_regime ?? "simples_nacional"}
          className={INPUT}
        >
          {TAX_REGIMES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      <div>
        <SubmitButton pendingLabel="Salvando…">Adicionar CNPJ</SubmitButton>
      </div>
      <FormError state={state} />
    </form>
  );
}

export function StoreForm({ companyId }: { companyId: string }) {
  const [state, action] = useActionState<FormState, FormData>(createStore, {});
  const v = state.values ?? {};
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
      <input type="hidden" name="company_id" value={companyId} />
      <label className="space-y-1 text-sm font-medium">
        <span>Marketplace</span>
        <select name="marketplace" defaultValue={v.marketplace} className={INPUT}>
          {MARKETPLACES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1 text-sm font-medium">
        <span>Nome da loja</span>
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={v.name}
          placeholder="Ex.: Loja principal"
          className={INPUT}
        />
      </label>
      <div>
        <SubmitButton variant="secondary" pendingLabel="Salvando…">
          Adicionar loja
        </SubmitButton>
      </div>
      <FormError state={state} />
    </form>
  );
}
