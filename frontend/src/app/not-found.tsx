import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-20">
      <EmptyState
        title="Página não encontrada"
        description="O endereço pode estar errado ou o item não existe mais."
        action={<ButtonLink href="/dashboard">Voltar para a visão geral</ButtonLink>}
      />
    </main>
  );
}
