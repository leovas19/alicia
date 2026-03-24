"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="px-4 pb-6 pt-2">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 rounded-[28px] border border-[var(--border)] bg-[rgba(255,250,243,0.7)] px-5 py-5 shadow-soft backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div>
          <p className="title-font text-lg">Lentement. Proprement. Sincèrement.</p>
          <p className="text-sm text-[var(--muted)]">
            Un espace pensé pour respirer, sourire un peu, et laisser du temps au temps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          <Link href="/connexion-alicia" className="transition hover:text-[var(--foreground)]">
            Connexion Alicia
          </Link>
          <Link href="/alicia/barres" className="transition hover:text-[var(--foreground)]">
            Gérer les barres
          </Link>
          <form action="/api/auth/logout" method="post">
            <button className="transition hover:text-[var(--foreground)]" type="submit">
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
