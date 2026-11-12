import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  checkCredentials,
  createSessionToken,
  isAuthConfigured,
  sessionCookieOptions,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Very small in-memory brute-force brake (per server instance).
const attempts = new Map<string, { n: number; until: number }>();

export async function POST(req: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET in your environment variables, then restart / redeploy.",
      },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const a = attempts.get(ip);
  if (a && a.until > Date.now()) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const email = String(body.email || "");
  const password = String(body.password || "");

  if (!checkCredentials(email, password)) {
    const n = (a?.n || 0) + 1;
    // After 5 wrong tries, lock this IP out for 60 seconds.
    attempts.set(ip, n >= 5 ? { n: 0, until: Date.now() + 60_000 } : { n, until: 0 });
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  attempts.delete(ip);
  const token = await createSessionToken(email.trim().toLowerCase());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
