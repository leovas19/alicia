import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

type PlaylistRow = {
  id: string;
  title: string;
  artist: string;
  url: string | null;
  rating: number | bigint | null;
  orderIndex: number | bigint;
};

function normalizePlaylistRow(row: PlaylistRow) {
  return {
    ...row,
    rating: Number(row.rating ?? 0),
    orderIndex: Number(row.orderIndex)
  };
}

export async function GET() {
  await ensureSeedData();
  const items = (await prisma.$queryRawUnsafe(`
    SELECT id, title, artist, url, COALESCE(rating, 0) AS rating, orderIndex
    FROM PlaylistItem
    ORDER BY orderIndex ASC
  `)) as PlaylistRow[];

  return NextResponse.json(items.map(normalizePlaylistRow));
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

  const [maxOrderRow] = (await prisma.$queryRawUnsafe(`
    SELECT COALESCE(MAX(orderIndex), 0) AS maxOrder
    FROM PlaylistItem
  `)) as Array<{ maxOrder: number | null }>;

  const id = randomUUID();
  const orderIndex = Number(maxOrderRow?.maxOrder ?? 0) + 1;

  await prisma.$executeRawUnsafe(
    `
      INSERT INTO PlaylistItem (id, title, artist, url, rating, orderIndex)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    id,
    title,
    artist,
    url,
    rating,
    orderIndex
  );

  const [item] = (await prisma.$queryRawUnsafe(
    `
      SELECT id, title, artist, url, COALESCE(rating, 0) AS rating, orderIndex
      FROM PlaylistItem
      WHERE id = ?
      LIMIT 1
    `,
    id
  )) as PlaylistRow[];

  return NextResponse.json(normalizePlaylistRow(item), { status: 201 });
}
