import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = { title: "Sobre o projeto" };

const NUMBERS = [
  { value: "514", label: "rotas de tela mapeadas" },
  { value: "1.979", label: "chamadas de API do frontend" },
  { value: "12", label: "telas observadas com a conta logada" },
  { value: "0", label: "linhas de código ou imagens copiadas" },
];

const MODULES = [
  {
    href: "/dashboard",
    label: "Início",
    text: "Tarefas do dia, o que corrigir no lucro e vendas.",
  },
  { href: "/produtos", label: "Produtos", text: "Lucro e saúde de cada produto, por canal." },
  {
    href: "/produtos/mapeamento",
    label: "Mapeamento de SKU",
    text: "Anúncios que vendem sem lucro calculado e como resolver.",
  },
  {
    href: "/custos",
    label: "Custos",
    text: "Custo do produto com vigência, sem apagar o passado.",
  },
  { href: "/pedidos", label: "Pedidos", text: "Ponta a ponta, com prazo, devolução e lucro." },
  { href: "/atendimento", label: "SAC", text: "Perguntas e reclamações com prazo de resposta." },
  { href: "/analises", label: "Análises", text: "Alertas de lucro e comparação por marketplace." },
  { href: "/financeiro", label: "Financeiro", text: "Lucro da loja depois dos custos fixos." },
];

/** Case do portfólio: por que o GSeller existe e como foi feito (Bloco 60.10). */
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Projeto de portfólio</p>
        <h1 className="mt-1 text-3xl font-semibold">
          O UpSeller mostra o pedido. O GSeller mostra quanto ele deu de lucro e o que fazer.
        </h1>
        <p className="mt-3 text-fg-muted">
          Protótipo de um painel para quem vende no Mercado Livre e na Shopee. Todos os dados são
          fictícios e nada do que você muda é salvo.
        </p>
      </header>

      <Card>
        <CardHeader title="O problema" />
        <p className="text-sm leading-relaxed">
          O seller pequeno vê faturamento e pedidos, mas não sabe quanto sobrou de cada venda depois
          de comissão, frete, anúncio, devolução, imposto e custo do produto. Vende mais e lucra
          menos sem perceber.
        </p>
      </Card>

      <Card>
        <CardHeader title="O método: engenharia reversa funcional do UpSeller" />
        <p className="text-sm leading-relaxed">
          O UpSeller é a ferramenta mais usada pelos sellers com quem conversei. Em vez de adivinhar
          o que eles esperam, mapeei o produto com a ferramenta de engenharia reversa REA, de forma
          passiva e só com o que chega ao navegador: telas, rotas, chamadas de rede e textos, com a
          minha própria conta. O backend dele continua fora de alcance. Do UpSeller vieram só a
          organização das telas e o vocabulário que o seller já conhece; nada de código, imagem ou
          marca entrou no GSeller.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {NUMBERS.map((n) => (
            <div key={n.label}>
              <dt className="sr-only">{n.label}</dt>
              <dd className="text-2xl font-semibold tabular-nums">{n.value}</dd>
              <dd className="text-xs text-fg-muted">{n.label}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card>
        <CardHeader title="O que o mapa mostrou" />
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>
            O UpSeller é, antes de tudo, um ERP fiscal e de anúncios multicanal: notas fiscais e
            Mercado Livre concentram a maior parte das chamadas; lucro é um relatório entre muitos.
          </li>
          <li>
            O lucro dele sai no dia seguinte, só com pedidos já liquidados, sem o imposto do CNPJ e
            sem dizer o que fazer.
          </li>
          <li>
            Daí o recorte do GSeller: copiar a organização que o seller já conhece e mostrar o lucro
            com imposto, no dia, e com a ação a tomar.
          </li>
        </ul>
      </Card>

      <Card>
        <CardHeader title="O que tem no protótipo" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {MODULES.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="font-medium text-primary hover:underline">
                {m.label}
              </Link>
              <p className="text-sm text-fg-muted">{m.text}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Como foi construído" />
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>
            Next.js e TypeScript no frontend; FastAPI e PostgreSQL com isolamento por conta no
            backend.
          </li>
          <li>
            Cada regra de dinheiro é uma função pura com testes de valores conferidos à mão: lucro,
            devolução, custos fixos, vínculo de SKU e preço mínimo.
          </li>
          <li>Lint, tipos, código morto e testes rodam no CI em todo pull request.</li>
          <li>
            Código aberto em{" "}
            <a
              href="https://github.com/GustavoHMS21/GSeller"
              className="font-medium text-primary hover:underline"
            >
              github.com/GustavoHMS21/GSeller
            </a>
            .
          </li>
          <li>
            Login e cobrança existem no código, mas ficam fora do protótipo. A integração real com
            os marketplaces não foi feita.
          </li>
        </ul>
      </Card>
    </article>
  );
}
