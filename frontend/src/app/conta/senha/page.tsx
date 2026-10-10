import type { Metadata } from "next";
import { PasswordForm } from "@/app/conta/senha/password-form";

export const metadata: Metadata = { title: "Defina sua senha" };

export default function SetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-6">
        <h1 className="text-xl font-semibold">Defina sua senha</h1>
        <p className="mt-1 mb-6 text-sm text-fg-muted">
          E-mail confirmado. Agora escolha a senha para entrar nas próximas vezes.
        </p>
        <PasswordForm />
      </div>
    </main>
  );
}
