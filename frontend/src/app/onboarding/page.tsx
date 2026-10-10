import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingForm } from "@/app/onboarding/onboarding-form";
import { Skeleton } from "@/components/ui/states";
import { apiFetch, type Me } from "@/lib/api";
import { HOME_PATH } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "Criar empresa" };

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-6">
        <h1 className="text-xl font-semibold">Crie sua empresa</h1>
        <p className="mt-1 mb-6 text-sm text-fg-muted">
          É o espaço onde ficam suas conexões, produtos e custos. Você pode mudar o nome depois.
        </p>
        <Suspense fallback={<Skeleton className="h-36" />}>
          <OnboardingGate />
        </Suspense>
      </div>
    </main>
  );
}

async function OnboardingGate() {
  const me = await apiFetch<Me>("/api/me");
  if (me.tenant) redirect(HOME_PATH);
  return <OnboardingForm />;
}
