import { NextResponse } from "next/server";
import { getDb, isDbConfigured } from "@/lib/server/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/contact — public contact form → messages collection. */
export async function POST(req: Request) {
  if (!isDbConfigured) return NextResponse.json({ error: "db_unavailable" }, { status: 503 });

  let b: any = {};
  try {
    b = await req.json();
  } catch {}

  // Honeypot: real users never fill the hidden "website" field; bots usually do.
  if (b.website) return NextResponse.json({ ok: true });

  const name = String(b.name || "").trim().slice(0, 200);
  const email = String(b.email || "").trim().slice(0, 200);
  const subject = String(b.subject || "").trim().slice(0, 300) || null;
  const body = String(b.body || "").trim().slice(0, 5000);

  if (!name || !body || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection("messages").insertOne({ name, email, subject, body, is_read: false, created_at: new Date() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  }
}
