import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSeedData();
  const { id } = await params;
  const place = await prisma.visitedPlace.findUnique({
    where: {
      id
    }
  });

  if (!place) {
    return NextResponse.json({ error: "Lieu introuvable." }, { status: 404 });
  }

  await prisma.visitedPlace.delete({
    where: {
      id
    }
  });

  return NextResponse.json({ ok: true });
}
