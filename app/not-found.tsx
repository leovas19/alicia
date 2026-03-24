import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[72vh] items-center justify-center py-10">
      <section className="panel max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">404</p>
        <h1 className="title-font mt-3 text-5xl">Cette page s’est éloignée doucement.</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          Rien de grave. Elle n’est simplement pas ici. Le plus simple reste de revenir au début.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/" className="button-primary">
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </div>
  );
}
