import { NextResponse } from "next/server";
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSeedData();
  const { id } = await params;
  const body = (await request.json()) as { rating?: number };
  const rating = Math.min(5, Math.max(0, Number(body.rating ?? 0)));

  const updated = await prisma.$executeRawUnsafe(
    `
      UPDATE PlaylistItem
      SET rating = ?
      WHERE id = ?
    `,
    rating,
    id
  );

  if (!updated) {
    return NextResponse.json({ error: "Musique introuvable." }, { status: 404 });
  }

  const [item] = (await prisma.$queryRawUnsafe(
    `
      SELECT id, title, artist, url, COALESCE(rating, 0) AS rating, orderIndex
      FROM PlaylistItem
      WHERE id = ?
      LIMIT 1
    `,
    id
  )) as PlaylistRow[];

  return NextResponse.json(normalizePlaylistRow(item));
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSeedData();
  const { id } = await params;
  const deleted = await prisma.$executeRawUnsafe(
    `
      DELETE FROM PlaylistItem
      WHERE id = ?
    `,
    id
  );

  if (!deleted) {
    return NextResponse.json({ error: "Musique introuvable." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
