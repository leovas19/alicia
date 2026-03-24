import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function GET() {
  await ensureSeedData();
  const books = await prisma.book.findMany({
    include: {
      pages: {
        orderBy: {
          pageNumber: "asc"
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(books);
}

export async function POST(request: Request) {
  await ensureSeedData();
  const body = (await request.json()) as {
    title?: string;
    dateLabel?: string;
    coverImageUrl?: string | null;
    pages?: string[];
  };

  const title = body.title?.trim();
  const pages = body.pages?.map((page) => page.trim()).filter(Boolean) || [];

  if (!title) {
    return NextResponse.json({ error: "Un titre est nécessaire." }, { status: 400 });
  }

  if (pages.length === 0) {
    return NextResponse.json(
      { error: "Ajoute au moins une image." },
      { status: 400 }
    );
  }

  const created = await prisma.book.create({
    data: {
      title,
      dateLabel: body.dateLabel?.trim() || null,
      coverImageUrl: body.coverImageUrl || pages[0] || null,
      pages: {
        create: pages.map((imageUrl, index) => ({
          content: "",
          optionalImageUrl: imageUrl,
          pageNumber: index + 1
        }))
      }
    }
  });

  return NextResponse.json(created, { status: 201 });
}
