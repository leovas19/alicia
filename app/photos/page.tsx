import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { PhotoUploader } from "@/components/photo-uploader";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

export default async function PhotosPage({
  searchParams
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  await ensureSeedData();
  const resolved = searchParams ? await searchParams : undefined;
  const rawPage = Number(resolved?.page || "1");
  const total = await prisma.photo.count();

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(totalPages, Math.max(1, Number.isFinite(rawPage) ? rawPage : 1));
  const skip = (currentPage - 1) * PAGE_SIZE;

  const photos = await prisma.photo.findMany({
    orderBy: {
      createdAt: "desc"
    },
    skip,
    take: PAGE_SIZE
  });

  return (
    <div className="space-y-6 pb-4 pt-6">
      <PageIntro
        eyebrow="Souvenirs"
        title="Galerie photos"
        description="Pas de légendes. Pas de commentaires. Juste une suite d’images et de vidéos propres, respirantes, avec une vraie pagination quand la galerie grandit."
      />

      <div className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <PhotoUploader />

        <section className="panel">
          {photos.length === 0 ? (
            <div className="flex min-h-80 items-center justify-center rounded-[24px] bg-[rgba(255,252,248,0.86)] text-center">
              <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
                La galerie est encore silencieuse. Une image ou une vidéo suffit pour commencer le mur de
                souvenirs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-[24px] bg-[rgba(255,252,248,0.84)]"
                >
                  {photo.mediaType?.startsWith("video/") ? (
                    <video
                      className="h-full min-h-44 w-full object-cover"
                      controls
                      preload="metadata"
                      src={photo.imageUrl}
                    />
                  ) : (
                    <img
                      alt="Souvenir"
                      className="h-full min-h-44 w-full object-cover transition duration-500 hover:scale-105"
                      src={photo.imageUrl}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="panel flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[var(--muted)]">
          Page {currentPage} sur {totalPages}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className={`button-secondary ${currentPage === 1 ? "pointer-events-none opacity-40" : ""}`}
            href={`/photos?page=${Math.max(1, currentPage - 1)}`}
          >
            Précédent
          </Link>
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <Link
                key={page}
                className={page === currentPage ? "button-primary" : "button-secondary"}
                href={`/photos?page=${page}`}
              >
                {page}
              </Link>
            );
          })}
          <Link
            className={`button-secondary ${currentPage === totalPages ? "pointer-events-none opacity-40" : ""}`}
            href={`/photos?page=${Math.min(totalPages, currentPage + 1)}`}
          >
            Suivant
          </Link>
        </div>
      </section>
    </div>
  );
}
