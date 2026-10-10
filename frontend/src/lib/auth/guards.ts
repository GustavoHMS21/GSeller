// Regras de acesso usadas pelo proxy e pelas ações de login. Funções puras.

export const LOGIN_PATH = "/login";
export const HOME_PATH = "/dashboard";

const PUBLIC_PREFIXES = [LOGIN_PATH, "/auth/"];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}

/**
 * Destino interno seguro para depois do login. Só aceita caminhos do próprio site:
 * "//evil.com", "/\\evil.com" e URLs absolutas são descartados (open redirect).
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next?.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return HOME_PATH;
  }
  return isPublicPath(next) ? HOME_PATH : next;
}

/** Para onde o proxy deve redirecionar, ou null para seguir. */
export function authRedirect(
  pathname: string,
  search: string,
  authenticated: boolean,
): string | null {
  if (!authenticated && !isPublicPath(pathname)) {
    return `${LOGIN_PATH}?next=${encodeURIComponent(pathname + search)}`;
  }
  if (authenticated && pathname === LOGIN_PATH) return HOME_PATH;
  return null;
}

export type Credentials = { email: string; password: string };

export const MIN_PASSWORD_LENGTH = 8;

/** Validação na fronteira de confiança: o formulário vem do navegador. */
export function parseCredentials(form: FormData): Credentials | { error: string } {
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { error: "Informe um e-mail válido." };
  }
  if (password.length < MIN_PASSWORD_LENGTH || password.length > 128) {
    return { error: `A senha precisa ter entre ${MIN_PASSWORD_LENGTH} e 128 caracteres.` };
  }
  return { email, password };
}
