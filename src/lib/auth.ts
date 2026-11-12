import { SignJWT, jwtVerify } from "jose";

/**
 * Admin authentication.
 *
 * The admin account lives in environment variables (ADMIN_EMAIL / ADMIN_PASSWORD),
 * NOT in the database. That means you can always log in to the dashboard, even if
 * the database is down, paused or empty.
 *
 * A successful login sets an httpOnly cookie containing a signed JWT (HS256,
 * signed with AUTH_SECRET). This file only uses `jose`, so it is safe to import
 * from middleware (Edge runtime) as well as from Node route handlers.
 */

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function clean(v?: string) {
  // Defend against accidental spaces / quotes copied into env values.
  return v?.trim().replace(/^["']|["']$/g, "") || "";
}

export const ADMIN_EMAIL = () => clean(process.env.ADMIN_EMAIL).toLowerCase();
export const ADMIN_PASSWORD = () => clean(process.env.ADMIN_PASSWORD);

export function isAuthConfigured() {
  return Boolean(ADMIN_EMAIL() && ADMIN_PASSWORD() && clean(process.env.AUTH_SECRET).length >= 16);
}

function secretKey() {
  const secret = clean(process.env.AUTH_SECRET);
  if (secret.length < 16) throw new Error("AUTH_SECRET is missing or too short (min 16 chars).");
  return new TextEncoder().encode(secret);
}

/** Constant-time string comparison (avoids timing leaks on the password check). */
export function safeEqual(a: string, b: string) {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  const len = Math.max(ea.length, eb.length);
  for (let i = 0; i < len; i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

export function checkCredentials(email: string, password: string) {
  if (!isAuthConfigured()) return false;
  const okEmail = safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL());
  const okPass = safeEqual(password, ADMIN_PASSWORD());
  return okEmail && okPass;
}

export async function createSessionToken(email: string) {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

/** Returns the admin email if the token is valid, otherwise null. Never throws. */
export async function verifySessionToken(token?: string | null): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (payload.role !== "admin" || typeof payload.email !== "string") return null;
    return payload.email;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
