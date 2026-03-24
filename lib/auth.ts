import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "alicia_session";
const BARS_COOKIE = "alicia_bars_initialized";
const SESSION_TTL = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.SESSION_SECRET || "dev-secret-change-this";
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function unbase64url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hashed] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !hashed) return false;

  const derived = scryptSync(password, salt, 64);
  const stored = Buffer.from(hashed, "hex");

  if (derived.length !== stored.length) return false;

  return timingSafeEqual(derived, stored);
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(username: string) {
  const payload = JSON.stringify({
    u: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL
  });
  const encodedPayload = base64url(payload);
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function parseSessionToken(token: string) {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;
  if (signPayload(encodedPayload) !== signature) return null;

  const payload = JSON.parse(unbase64url(encodedPayload)) as {
    u: string;
    exp: number;
  };

  if (!payload?.u || !payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = parseSessionToken(token);
  return session?.u ?? null;
}

export async function requireAlicia() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/connexion-alicia");
  }
  return user;
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionMaxAge() {
  return SESSION_TTL;
}

export function getBarsCookieName() {
  return BARS_COOKIE;
}
