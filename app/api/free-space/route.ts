import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function GET() {
  await ensureSeedData();
  const messages = await prisma.freeSpaceMessage.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  await ensureSeedData();
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = (await request.json()) as { content?: string };
  const content = body.content?.trim() || "";

  if (!content) {
    return NextResponse.json({ error: "Le message est vide." }, { status: 400 });
  }

  const message = await prisma.freeSpaceMessage.create({
    data: {
      content
    }
  });

  return NextResponse.json(message, { status: 201 });
}
