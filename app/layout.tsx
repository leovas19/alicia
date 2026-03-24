import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Alicia & Léo",
  description: "Une expérience intime, douce et interactive."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SiteHeader />
        <main className="app-shell">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
