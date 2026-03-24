import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function GET() {
  await ensureSeedData();
  const challenges = await prisma.challenge.findMany({
    orderBy: {
      createdAt: "asc"
    }
  });

  return NextResponse.json(challenges);
}

export async function POST(request: Request) {
  await ensureSeedData();
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    status?: string;
  };

  const title = body.title?.trim() || "";
  const status = body.status?.trim() || "à faire";

  if (!title) {
    return NextResponse.json({ error: "Le défi est vide." }, { status: 400 });
  }

  const challenge = await prisma.challenge.create({
    data: {
      title,
      status
    }
  });

  return NextResponse.json(challenge, { status: 201 });
}
