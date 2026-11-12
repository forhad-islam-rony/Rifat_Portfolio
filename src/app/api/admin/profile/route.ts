import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/mongodb";
import { adminRoute } from "@/lib/server/session";
import { sanitize, serialize } from "@/lib/server/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/admin/profile — the single profile document */
export const GET = adminRoute(async () => {
  const db = await getDb();
  const doc = await db.collection("profile").findOne({}, { sort: { _id: 1 } });
  return NextResponse.json({ profile: serialize(doc) });
});

/** PUT /api/admin/profile — upsert the single profile document */
export const PUT = adminRoute(async (req) => {
  const update = { ...sanitize("profile", await req.json(), true), updated_at: new Date() };
  const db = await getDb();
  const col = db.collection("profile");
  const existing = await col.findOne({}, { sort: { _id: 1 }, projection: { _id: 1 } });
  const saved = existing
    ? await col.findOneAndUpdate({ _id: existing._id }, { $set: update }, { returnDocument: "after" })
    : await col.findOne({ _id: (await col.insertOne(update)).insertedId });
  return NextResponse.json({ profile: serialize(saved) });
});
