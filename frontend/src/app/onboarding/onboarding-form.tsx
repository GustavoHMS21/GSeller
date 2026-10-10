"use client";

import { useActionState } from "react";
import { createTenant, type OnboardingState } from "@/app/onboarding/actions";
import { SubmitButton } from "@/components/ui/submit-button";

export function OnboardingForm() {
  const [state, action] = useActionState<OnboardingState, FormData>(createTenant, {});
  return (
    <form action={action} className="space-y-4">
      <label className="block space-y-1 text-sm font-medium">
        <span>Nome da operação</span>
        <input
          name="name"
          required
          minLength={2}
          maxLength={120}
          placeholder="Ex.: Loja da Ana"
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
        />
      </label>
      {state.error && (
        <p role="alert" className="rounded-md bg-danger-soft p-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      <SubmitButton pendingLabel="Criando…">Criar empresa</SubmitButton>
    </form>
  );
}
