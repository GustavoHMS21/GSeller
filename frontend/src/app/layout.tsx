import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GSeller", template: "%s · GSeller" },
  description: "Inteligência financeira para sellers de Mercado Livre e Shopee.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
