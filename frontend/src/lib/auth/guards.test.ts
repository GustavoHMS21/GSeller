import { describe, expect, it } from "vitest";
import { authRedirect, parseCredentials, safeNextPath } from "@/lib/auth/guards";

describe("authRedirect", () => {
  it.each([
    ["/dashboard", "", false, "/login?next=%2Fdashboard"],
    ["/produtos/kit", "?x=1", false, "/login?next=%2Fprodutos%2Fkit%3Fx%3D1"],
    ["/onboarding", "", false, "/login?next=%2Fonboarding"],
    ["/login", "", false, null],
    ["/auth/confirm", "?code=abc", false, null],
    ["/login", "", true, "/dashboard"],
    ["/dashboard", "", true, null],
  ] as const)("%s%s autenticado=%s → %s", (path, search, auth, expected) => {
    expect(authRedirect(path, search, auth)).toBe(expected);
  });
});

describe("safeNextPath bloqueia open redirect", () => {
  it.each([
    ["/produtos/kit", "/produtos/kit"],
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
