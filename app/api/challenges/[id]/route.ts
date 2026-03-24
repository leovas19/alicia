import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSeedData();
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as { status?: string; title?: string };
  const data: { status?: string; title?: string } = {};

  if (body.status) {
    data.status = body.status.trim();
  }

  if (body.title) {
    data.title = body.title.trim();
  }

  const challenge = await prisma.challenge.update({
    where: {
      id
    },
    data
  });

  return NextResponse.json(challenge);
}

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

  await prisma.challenge.delete({
    where: {
      id
    }
  });

  return NextResponse.json({ ok: true });
}
