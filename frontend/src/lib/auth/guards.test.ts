import { describe, expect, it } from "vitest";
import { authRedirect, parseCredentials, safeNextPath } from "@/lib/auth/guards";

describe("authRedirect: negar por padrão, demonstração aberta", () => {
  it.each([
    // Sem sessão: demonstração aberta, o resto exige login.
    ["/dashboard", "", "none", null],
    ["/produtos/kit", "", "none", null],
    ["/", "", "none", null],
    ["/onboarding", "", "none", "/login?next=%2Fonboarding"],
    ["/conta/senha", "", "none", "/login?next=%2Fconta%2Fsenha"],
    ["/rota-nova-qualquer", "?x=1", "none", "/login?next=%2Frota-nova-qualquer%3Fx%3D1"],
    ["/dashboard-falso", "", "none", "/login?next=%2Fdashboard-falso"],
    ["/auth/confirm", "?code=abc", "none", null],
    // Anônimo: mesma regra, mas cai direto em "Criar conta".
    ["/dashboard", "", "anonymous", null],
    ["/onboarding", "", "anonymous", "/login?next=%2Fonboarding&modo=criar"],
    ["/login", "", "anonymous", null],
    // Conta: tudo liberado; o login leva ao painel.
    ["/onboarding", "", "account", null],
    ["/login", "", "account", "/dashboard"],
  ] as const)("%s%s sessão=%s → %s", (path, search, session, expected) => {
    expect(authRedirect(path, search, session)).toBe(expected);
  });
});

describe("safeNextPath bloqueia open redirect", () => {
  it.each([
    ["/produtos/kit", "/produtos/kit"],
    ["/conta/senha", "/conta/senha"],
    [null, "/dashboard"],
    ["https://evil.com", "/dashboard"],
    ["//evil.com", "/dashboard"],
    ["/\\evil.com", "/dashboard"],
    ["/login", "/dashboard"],
  ])("%s → %s", (next, expected) => {
    expect(safeNextPath(next)).toBe(expected);
  });
});

describe("parseCredentials", () => {
  const form = (email: string, password: string) => {
    const f = new FormData();
    f.set("email", email);
    f.set("password", password);
    return f;
  };

  it("normaliza o e-mail", () => {
    expect(parseCredentials(form("  Seller@Loja.COM ", "senha-forte-1"))).toEqual({
      email: "seller@loja.com",
      password: "senha-forte-1",
    });
  });

  it.each([
    ["sem-arroba", "senha-forte-1"],
    ["a@b", "senha-forte-1"],
    ["seller@loja.com", "curta"],
    ["seller@loja.com", "x".repeat(129)],
  ])("rejeita %s / senha de %s caracteres", (email, password) => {
    expect(parseCredentials(form(email, password))).toHaveProperty("error");
  });
});
