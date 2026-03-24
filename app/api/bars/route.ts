import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clamp } from "@/lib/utils";
import { getBarsCookieName, getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function GET() {
  await ensureSeedData();
  const bars = await prisma.progressBars.findFirstOrThrow();
  return NextResponse.json(bars);
}

export async function PATCH(request: Request) {
  await ensureSeedData();
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = (await request.json()) as {
    trustValue?: number;
    relationshipValue?: number;
  };

  const current = await prisma.progressBars.findFirstOrThrow();
  const alicia = await prisma.aliciaUser.findFirstOrThrow();

  const updated = await prisma.progressBars.update({
    where: {
      id: current.id
    },
    data: {
      trustValue: clamp(Number(body.trustValue ?? current.trustValue)),
      relationshipValue: clamp(Number(body.relationshipValue ?? current.relationshipValue))
    }
  });

  if (!alicia.barsInitialized) {
    await prisma.aliciaUser.update({
      where: {
        id: alicia.id
      },
      data: {
        barsInitialized: true
      }
    });
  }

  const cookieStore = await cookies();
  cookieStore.set(getBarsCookieName(), "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });

  return NextResponse.json(updated);
}
