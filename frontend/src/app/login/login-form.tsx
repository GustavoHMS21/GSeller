"use client";

import Link from "next/link";
import { useActionState } from "react";
import { type AuthState, authenticate } from "@/app/login/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/guards";

const INPUT =
  "w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted";

export type LoginMode = "entrar" | "criar";

export function LoginForm({
  mode,
  next,
  linkError,
  anonymous,
}: {
  mode: LoginMode;
  next: string;
  linkError: boolean;
  anonymous: boolean;
}) {
  const [state, action] = useActionState<AuthState, FormData>(authenticate, {});
  const signup = mode === "criar";
  // No modo demonstração, a senha é definida depois de confirmar o e-mail.
  const askPassword = !(signup && anonymous);
  const error =
    state.error ??
    (linkError
      ? "O link de confirmação é inválido ou expirou. Tente entrar ou crie a conta de novo."
      : undefined);
  const switchTo = new URLSearchParams({
    ...(next && { next }),
    ...(!signup && { modo: "criar" }),
  });

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block space-y-1 text-sm font-medium">
        <span>E-mail</span>
        <input name="email" type="email" autoComplete="email" required className={INPUT} />
      </label>
      {askPassword && (
        <label className="block space-y-1 text-sm font-medium">
          <span>Senha</span>
          <input
            name="password"
            type="password"
            autoComplete={signup ? "new-password" : "current-password"}
            required
            minLength={MIN_PASSWORD_LENGTH}
            className={INPUT}
          />
        </label>
      )}

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

      <SubmitButton
        name="intent"
        value={signup ? "signup" : "signin"}
        pendingLabel={signup ? "Criando conta…" : "Entrando…"}
      >
        {signup ? "Criar conta" : "Entrar"}
      </SubmitButton>

      <p className="text-center text-sm text-fg-muted">
        {signup ? "Já tem conta? " : "Ainda não tem conta? "}
        <Link href={`/login?${switchTo}`} className="font-medium text-primary hover:underline">
          {signup ? "Entrar" : "Criar conta"}
        </Link>
      </p>
    </form>
  );
}
