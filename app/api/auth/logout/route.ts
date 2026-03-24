import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return NextResponse.redirect(new URL("/connexion-alicia", request.url));
}
