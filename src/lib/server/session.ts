import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "../auth";
import { isDbConfigured } from "./mongodb";

/** Returns the logged-in admin email (server components / route handlers), or null. */
export async function getAdmin(): Promise<string | null> {
  return verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
}

export function jsonError(message: string, status = 400, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

/**
 * Wrap an admin API handler: checks the session cookie and that MongoDB is
 * configured, and turns thrown errors into readable JSON instead of a blank 500.
 */
export function adminRoute<C>(handler: (req: Request, ctx: C) => Promise<Response>) {
  return async (req: Request, ctx: C) => {
    if (!(await getAdmin())) return jsonError("Not signed in.", 401);
    if (!isDbConfigured)
      return jsonError("Database not configured. Set MONGODB_URI in your environment variables.", 503);
    try {
      return await handler(req, ctx);
    } catch (err: any) {
      console.error("[admin api]", err);
      return jsonError(friendlyDbError(err), 500);
    }
  };
}

export function friendlyDbError(err: any): string {
  const msg = String(err?.message || err || "Unknown error");
  if (/ENOTFOUND|querySrv|getaddrinfo/i.test(msg))
    return "Can't find the MongoDB cluster. Check MONGODB_URI, and if you use Atlas make sure the cluster is not paused.";
  if (/auth|bad auth|Authentication failed/i.test(msg))
    return "MongoDB rejected the username/password in MONGODB_URI.";
  if (/Server selection timed out|timed out|ECONNREFUSED/i.test(msg))
    return "MongoDB didn't respond. In Atlas → Network Access, allow 0.0.0.0/0 (needed for Netlify/Vercel), and check the cluster isn't paused.";
  return msg;
}
