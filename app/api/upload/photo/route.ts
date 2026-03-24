import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await ensureSeedData();
  const body = (await request.json()) as {
    url?: string;
    mediaType?: string;
  };

  const imageUrl = body.url?.trim() || "";
  const mediaType = body.mediaType?.trim() || "";

  if (!imageUrl || !mediaType) {
    return NextResponse.json({ error: "URL ou type de média manquant." }, { status: 400 });
  }

  const photo = await prisma.photo.create({
    data: {
      imageUrl,
      mediaType
    }
  });

  return NextResponse.json(photo, { status: 201 });
}
