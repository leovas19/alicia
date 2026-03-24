import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSeedData();
  const { id } = await params;
  const body = (await request.json()) as { rating?: number };
  const rating = Math.min(5, Math.max(0, Number(body.rating ?? 0)));

  const item = await prisma.playlistItem.update({
    where: {
      id
    },
    data: {
      rating
    }
  });

  return NextResponse.json(item);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSeedData();
  const { id } = await params;
  await prisma.playlistItem.delete({
    where: {
      id
    }
  });

  return NextResponse.json({ ok: true });
}
