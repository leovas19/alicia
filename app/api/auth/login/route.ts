import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getBarsCookieName,
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAge,
  verifyPassword
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function POST(request: Request) {
  await ensureSeedData();
  const body = (await request.json()) as {
    password?: string;
  };

  const username = process.env.ALICIA_USERNAME || "alicia";
  const password = body.password || "";

  const user = await prisma.aliciaUser.findUnique({
    where: {
      username
    }
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), createSessionToken(user.username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionMaxAge()
  });

  const existingBarsCookie = cookieStore.get(getBarsCookieName())?.value === "true";
  const redirectTo = user.barsInitialized || existingBarsCookie ? "/confiance" : "/alicia/barres";

  return NextResponse.json({ ok: true, redirectTo });
}
