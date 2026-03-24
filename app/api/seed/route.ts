import { NextResponse } from "next/server";
import { ensureSeedData } from "@/lib/seed";

export async function GET() {
  await ensureSeedData();
  return NextResponse.json({ ok: true });
}
