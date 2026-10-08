/** Textos padronizados do "Como calculamos?" (Bloco 9). Fonte única para todas as telas. */

export function ResultFormula() {
  return (
    <>
      <p>
        <strong>Resultado estimado</strong> = receita elegível − desconto financiado por você −
        comissão e tarifas − frete assumido − Ads − devoluções − custo do produto − imposto estimado.
      </p>
      <p>Não é lucro contábil. Considera apenas produtos com custo cadastrado.</p>
    </>
  );
}

export function MarginFormula() {
  return (
    <>
      <p>
        <strong>Margem estimada</strong> = resultado estimado ÷ receita elegível dos produtos com
        custo cadastrado.
      </p>
      <p>A variação é mostrada em pontos percentuais (p.p.).</p>
    </>
  );
}

export function RevenueFormula() {
  return (
    <p>
      <strong>Receita elegível</strong> = soma dos pedidos pagos e não cancelados no período, pelo
      preço de venda. Receita atribuída a Ads <strong>não</strong> é somada aqui.
    </p>
  );
}
