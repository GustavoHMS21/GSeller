// Regras de acesso usadas pelo proxy e pelas ações de login. Funções puras.

export const LOGIN_PATH = "/login";
export const HOME_PATH = "/dashboard";
export const SET_PASSWORD_PATH = "/conta/senha";

/** Sem sessão, sessão anônima (modo demonstração, issue #33) ou conta com e-mail. */
export type SessionKind = "none" | "anonymous" | "account";

const AUTH_PREFIXES = [LOGIN_PATH, "/auth"];
// Telas que mostram só dados de demonstração. Todo o resto exige conta (negar por padrão).
// /planos fica aberto: é para onde vai quem terminou o trial, com ou sem conta.
const DEMO_PREFIXES = ["/dashboard", "/produtos", "/custos", "/conexoes", "/design", "/planos"];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

const isAuthPath = (pathname: string) => matches(pathname, AUTH_PREFIXES);

export function isPublicPath(pathname: string): boolean {
  return pathname === "/" || isAuthPath(pathname) || matches(pathname, DEMO_PREFIXES);
}

/**
 * Destino interno seguro para depois do login. Só aceita caminhos do próprio site:
 * "//evil.com", "/\\evil.com" e URLs absolutas são descartados (open redirect).
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next?.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return HOME_PATH;
  }
  return isAuthPath(next) ? HOME_PATH : next;
}

/** Para onde o proxy deve redirecionar, ou null para seguir. */
export function authRedirect(
  pathname: string,
  search: string,
  session: SessionKind,
): string | null {
  if (session === "account") return pathname === LOGIN_PATH ? HOME_PATH : null;
  if (isPublicPath(pathname)) return null;
  const params = new URLSearchParams({ next: pathname + search });
  // Quem já está no modo demonstração vai direto para "Criar conta".
  if (session === "anonymous") params.set("modo", "criar");
  return `${LOGIN_PATH}?${params}`;
}

export const MIN_PASSWORD_LENGTH = 8;

/** Validação na fronteira de confiança: o formulário vem do navegador. */
export function parseEmail(form: FormData): { email: string } | { error: string } {
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { error: "Informe um e-mail válido." };
  }
  return { email };
}

export function parsePassword(form: FormData): { password: string } | { error: string } {
  const password = String(form.get("password") ?? "");
  if (password.length < MIN_PASSWORD_LENGTH || password.length > 128) {
    return { error: `A senha precisa ter entre ${MIN_PASSWORD_LENGTH} e 128 caracteres.` };
  }
  return { password };
}

export function parseCredentials(
  form: FormData,
): { email: string; password: string } | { error: string } {
  const email = parseEmail(form);
  if ("error" in email) return email;
  const password = parsePassword(form);
  if ("error" in password) return password;
  return { ...email, ...password };
}
