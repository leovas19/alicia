import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { readVisitedPlaces, writeVisitedPlaces } from "@/lib/visited-places";

export const runtime = "nodejs";

export async function GET() {
  const places = await readVisitedPlaces();
  return NextResponse.json(places);
}

export async function POST(request: Request) {
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

  const places = await readVisitedPlaces();
  const nextPlace = {
    id: randomUUID(),
    name,
    country,
    note,
    latitude,
    longitude
  };

  const nextPlaces = [...places, nextPlace];
  await writeVisitedPlaces(nextPlaces);

  return NextResponse.json(nextPlace, { status: 201 });
}
