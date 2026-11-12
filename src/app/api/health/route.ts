import { NextResponse } from "next/server";
import { pingDb } from "@/lib/server/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health — pings MongoDB. Called daily by the scheduled keep-alive
 * (netlify/functions/keepalive.mts or vercel.json cron) so a free Atlas
 * cluster never sits idle long enough to be paused.
 */
export async function GET() {
  const r = await pingDb();
  return NextResponse.json({ db: r.ok ? "ok" : "error", time: new Date().toISOString() }, { status: r.ok ? 200 : 503 });
}
