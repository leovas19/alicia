import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSeedData();
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;

  await prisma.freeSpaceMessage.delete({
    where: {
      id
    }
  });

  return NextResponse.json({ ok: true });
}
