import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function GET() {
  await ensureSeedData();
  const items = await prisma.playlistItem.findMany({
    orderBy: {
      orderIndex: "asc"
    }
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  await ensureSeedData();
  const body = (await request.json()) as {
    title?: string;
    artist?: string;
    url?: string;
    rating?: number;
  };

  const title = body.title?.trim() || "";
  const artist = body.artist?.trim() || "";
  const url = body.url?.trim() || null;
  const rating = Math.min(5, Math.max(0, Number(body.rating ?? 0)));

  if (!title || !artist) {
    return NextResponse.json({ error: "Titre et artiste sont nécessaires." }, { status: 400 });
  }

  const maxOrder = await prisma.playlistItem.aggregate({
    _max: {
      orderIndex: true
    }
  });

  const item = await prisma.playlistItem.create({
    data: {
      title,
      artist,
      url,
      rating,
      orderIndex: (maxOrder._max.orderIndex || 0) + 1
    }
  });

  return NextResponse.json(item, { status: 201 });
}
