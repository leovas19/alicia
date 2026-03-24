import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export const runtime = "nodejs";

export async function GET() {
  await ensureSeedData();
  const places = await prisma.visitedPlace.findMany({
    orderBy: {
      orderIndex: "asc"
    }
  });

  return NextResponse.json(places);
}

export async function POST(request: Request) {
  await ensureSeedData();
  const body = (await request.json()) as {
    name?: string;
    country?: string;
    note?: string;
    latitude?: number;
    longitude?: number;
  };

  const name = body.name?.trim() || "";
  const country = body.country?.trim() || "";
  const note = body.note?.trim() || "";
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);

  if (!name || !country || !note) {
    return NextResponse.json({ error: "Nom, pays et message sont nécessaires." }, { status: 400 });
  }

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return NextResponse.json({ error: "Latitude invalide." }, { status: 400 });
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: "Longitude invalide." }, { status: 400 });
  }

  const maxOrder = await prisma.visitedPlace.aggregate({
    _max: {
      orderIndex: true
    }
  });

  const nextPlace = await prisma.visitedPlace.create({
    data: {
      name,
      country,
      note,
      latitude,
      longitude,
      orderIndex: (maxOrder._max.orderIndex || 0) + 1
    }
  });

  return NextResponse.json(nextPlace, { status: 201 });
}
