"use client";

import { useActionState } from "react";
import { type AuthState, authenticate } from "@/app/login/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/guards";

const INPUT =
  "w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted";

export function LoginForm({ next, linkError }: { next: string; linkError: boolean }) {
  const [state, action] = useActionState<AuthState, FormData>(authenticate, {});
  const error =
    state.error ??
    (linkError
      ? "O link de confirmação é inválido ou expirou. Tente entrar ou crie a conta de novo."
      : undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block space-y-1 text-sm font-medium">
        <span>E-mail</span>
        <input name="email" type="email" autoComplete="email" required className={INPUT} />
      </label>
      <label className="block space-y-1 text-sm font-medium">
        <span>Senha</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          className={INPUT}
        />
      </label>

      {error && (
        <p role="alert" className="rounded-md bg-danger-soft p-3 text-sm text-danger">
          {error}
        </p>
      )}
      {state.message && (
        <p role="status" className="rounded-md bg-success-soft p-3 text-sm text-success">
          {state.message}
        </p>
      )}

      <div className="space-y-2 pt-2">
        <SubmitButton name="intent" value="signin" pendingLabel="Entrando…">
          Entrar
        </SubmitButton>
        <SubmitButton
          name="intent"
          value="signup"
          variant="secondary"
          pendingLabel="Criando conta…"
        >
          Criar conta
        </SubmitButton>
      </div>
    </form>
  );
}
