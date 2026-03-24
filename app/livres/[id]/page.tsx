import { notFound } from "next/navigation";
import { BookReader } from "@/components/book-reader";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await ensureSeedData();
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      pages: {
        orderBy: {
          pageNumber: "asc"
        }
      }
    }
  });

  if (!book) {
    notFound();
  }

  return (
    <div className="pb-4 pt-6">
      <BookReader title={book.title} pages={book.pages} />
    </div>
  );
}
