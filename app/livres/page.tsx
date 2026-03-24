import Link from "next/link";
import { BookForm } from "@/components/book-form";
import { PageIntro } from "@/components/page-intro";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  await ensureSeedData();
  const books = await prisma.book.findMany({
    include: {
      pages: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-6 pb-4 pt-6">
      <PageIntro
        eyebrow="Bibliothèque"
        title="Galerie des livres"
        description="Une collection émotionnelle simple à parcourir, avec des couvertures, des dates et des pages à ouvrir doucement."
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/livres/${book.id}`}
              className="panel block transition hover:-translate-y-1"
            >
              {book.coverImageUrl ? (
                <div
                  className="mb-4 h-56 rounded-[22px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${book.coverImageUrl})` }}
                />
              ) : (
                <div className="mb-4 flex h-56 items-end rounded-[22px] bg-[linear-gradient(160deg,#f4e6d7,#e0c6bf)] p-5">
                  <span className="title-font text-3xl">Livre</span>
                </div>
              )}
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                {book.dateLabel || "Sans date"}
              </p>
              <h2 className="title-font mt-3 text-3xl">{book.title}</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {book.pages.length} page{book.pages.length > 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>

        <BookForm />
      </div>
    </div>
  );
}
