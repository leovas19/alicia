"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/livres", label: "Livres" },
  { href: "/photos", label: "Photos" },
  { href: "/jeu-gugus", label: "Jeux" },
  { href: "/confiance", label: "Confiance" },
  { href: "/playlist", label: "Playlist" },
  { href: "/plus-de-nous", label: "Plus de nous" },
  { href: "/nos-endroits", label: "Nos endroits" },
  { href: "/mots", label: "Mots" },
  { href: "/espace-libre", label: "Espace libre" }
];

export function SiteHeader() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-3 rounded-[28px] border border-[var(--border)] bg-[rgba(252,248,240,0.72)] px-4 py-4 shadow-soft backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Alicia & Léo
            </span>
            <span className="title-font text-xl">Un endroit à part</span>
          </Link>

          <Link
            href={pathname.startsWith("/alicia") ? "/alicia/barres" : "/connexion-alicia"}
            className={`rounded-full px-3 py-2 text-sm transition ${
              pathname.startsWith("/alicia")
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--muted)]"
            }`}
          >
            {pathname.startsWith("/alicia") ? "Barres Alicia" : "Accès Alicia"}
          </Link>
        </div>

        <nav className="thin-scrollbar flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="pill whitespace-nowrap text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
