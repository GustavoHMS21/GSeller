import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/app/login/login-form";
import { Skeleton } from "@/components/ui/states";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-6">
        <h1 className="text-xl font-semibold">Entrar no GSeller</h1>
        <p className="mt-1 mb-6 text-sm text-fg-muted">
          Esta é a sua conta no GSeller. A conexão com o Mercado Livre e a Shopee é feita depois,
          pela autorização oficial de cada marketplace.
        </p>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <LoginFormFromParams searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

// Lê a URL no servidor: o formulário chega pronto no HTML, sem esperar o JavaScript.
async function LoginFormFromParams({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "";
  return <LoginForm next={next} linkError={params.erro === "confirmacao"} />;
}
