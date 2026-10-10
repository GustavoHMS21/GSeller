import type { NextConfig } from "next";

// Bloqueia o build se alguma variável exposta ao navegador tiver nome de segredo.
// Variáveis NEXT_PUBLIC_* são embutidas no bundle público durante o build.
const FORBIDDEN_PUBLIC_ENV =
  /SECRET|PRIVATE|PASSWORD|TOKEN|PARTNER_KEY|SERVICE_ROLE|DATABASE|ENCRYPTION/i;
const leakedPublicEnv = Object.keys(process.env).filter(
  (name) => name.startsWith("NEXT_PUBLIC_") && FORBIDDEN_PUBLIC_ENV.test(name),
);
if (leakedPublicEnv.length > 0) {
  throw new Error(
    `Variáveis públicas com nome de segredo: ${leakedPublicEnv.join(", ")}. ` +
      "Segredos devem existir apenas no backend.",
  );
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
