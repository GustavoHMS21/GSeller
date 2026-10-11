import type { Metadata } from "next";
import { Suspense } from "react";
import { deleteCompany, deleteStore } from "@/app/(app)/empresas/actions";
import { CompanyForm, StoreForm } from "@/app/(app)/empresas/forms";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { EmptyState, Skeleton } from "@/components/ui/states";
import { SubmitButton } from "@/components/ui/submit-button";
import { apiFetch, type Company, type Me } from "@/lib/api";
import { formatCnpj, taxRegimeLabel } from "@/lib/business";

export const metadata: Metadata = { title: "Empresas e lojas" };

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Empresas e lojas</h1>
      <Suspense fallback={<Skeleton className="h-64" />}>
        <CompaniesContent />
      </Suspense>
    </div>
  );
}

async function CompaniesContent() {
  const [companies, me] = await Promise.all([
    apiFetch<Company[]>("/api/companies"),
    apiFetch<Me>("/api/me"),
  ]);
  const isOwner = me.role === "OWNER";

  return (
    <>
      {companies.length === 0 && (
        <EmptyState
          title="Nenhum CNPJ cadastrado"
          description="Cadastre o CNPJ que vende nos marketplaces. Cada loja fica ligada a um CNPJ."
        />
      )}

      {companies.map((company) => (
        <Card key={company.id}>
          <CardHeader
            title={company.legal_name}
            description={`${formatCnpj(company.cnpj)} · ${taxRegimeLabel(company.tax_regime)}`}
            action={
              isOwner &&
              company.stores.length === 0 && (
                <form action={deleteCompany.bind(null, company.id)}>
                  <SubmitButton variant="ghost" pendingLabel="Removendo…">
                    Remover CNPJ
                  </SubmitButton>
                </form>
              )
            }
          />

          {company.stores.length > 0 && (
            <ul className="mb-4 divide-y divide-line rounded-md border border-line">
              {company.stores.map((store) => (
                <li key={store.id} className="flex flex-wrap items-center gap-3 px-3 py-2">
                  <MarketplaceBadge marketplace={store.marketplace} />
                  <span className="font-medium">{store.name}</span>
                  <Badge tone="warning" icon="○">
                    Não conectada
                  </Badge>
                  {isOwner && (
                    <form action={deleteStore.bind(null, store.id)} className="ml-auto">
                      <SubmitButton variant="ghost" pendingLabel="Removendo…">
                        Remover
                      </SubmitButton>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}

          {isOwner && <StoreForm companyId={company.id} />}
        </Card>
      ))}

      {isOwner && (
        <Card>
          <CardHeader title="Adicionar CNPJ" as="h2" />
          <CompanyForm />
        </Card>
      )}
    </>
  );
}
