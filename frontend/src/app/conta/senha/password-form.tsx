"use client";

import { useActionState } from "react";
import { type PasswordState, setPassword } from "@/app/conta/senha/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/guards";

export function PasswordForm() {
  const [state, action] = useActionState<PasswordState, FormData>(setPassword, {});
  return (
    <form action={action} className="space-y-4">
      <label className="block space-y-1 text-sm font-medium">
        <span>Nova senha</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg"
        />
        <span className="block text-xs font-normal text-fg-muted">
          Pelo menos {MIN_PASSWORD_LENGTH} caracteres.
        </span>
      </label>
      {state.error && (
        <p role="alert" className="rounded-md bg-danger-soft p-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      <SubmitButton pendingLabel="Salvando…">Salvar senha</SubmitButton>
    </form>
  );
}
