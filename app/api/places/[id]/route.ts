import { NextResponse } from "next/server";
import { readVisitedPlaces, writeVisitedPlaces } from "@/lib/visited-places";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const places = await readVisitedPlaces();
  const nextPlaces = places.filter((place) => place.id !== id);

  if (nextPlaces.length === places.length) {
    return NextResponse.json({ error: "Lieu introuvable." }, { status: 404 });
  }

  await writeVisitedPlaces(nextPlaces);

  return NextResponse.json({ ok: true });
}
