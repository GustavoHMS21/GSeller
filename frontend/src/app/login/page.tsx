import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm, type LoginMode } from "@/app/login/login-form";
import { Skeleton } from "@/components/ui/states";
import { getSessionKind } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-6">
        <Suspense fallback={<Skeleton className="h-80" />}>
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

// Lê a URL e a sessão no servidor: o formulário chega pronto no HTML, sem esperar o JavaScript.
async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const mode: LoginMode = params.modo === "criar" ? "criar" : "entrar";
  const anonymous = (await getSessionKind()) === "anonymous";
  const next = typeof params.next === "string" ? params.next : "";

  return (
    <>
      <h1 className="text-xl font-semibold">
        {mode === "criar" ? "Crie sua conta" : "Entrar no GSeller"}
      </h1>
      <p className="mt-1 mb-6 text-sm text-fg-muted">
        {mode === "criar"
          ? "Com a conta, seus dados ficam salvos e você pode conectar o Mercado Livre. Seu período de teste continua o mesmo."
          : "Esta é a sua conta no GSeller. A conexão com os marketplaces é feita depois, pela autorização oficial de cada um."}
      </p>
      <LoginForm
        mode={mode}
        next={next}
        linkError={params.erro === "confirmacao"}
        anonymous={anonymous}
      />
      <p className="mt-6 text-center text-sm">
        <Link href="/dashboard" className="text-fg-muted hover:text-fg hover:underline">
          Continuar no modo demonstração
        </Link>
      </p>
    </>
  );
}
