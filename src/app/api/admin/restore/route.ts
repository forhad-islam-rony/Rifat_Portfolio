import { NextResponse } from "next/server";
import { GridFSBucket } from "mongodb";
import { getDb } from "@/lib/server/mongodb";
import { adminRoute, jsonError } from "@/lib/server/session";
import { ALL_COLLECTIONS, sanitize, toObjectId } from "@/lib/server/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/restore — replaces the database content with a backup file
 * produced by /api/admin/backup (or scripts/backup.mjs / import-supabase.mjs).
 * Only collections present in the file are replaced.
 */
export const POST = adminRoute(async (req) => {
  let backup: any;
  try {
    backup = await req.json();
  } catch {
    return jsonError("That file is not valid JSON.");
  }
  if (!backup || typeof backup.collections !== "object") return jsonError("That doesn't look like a portfolio backup file.");

  const db = await getDb();
  const summary: Record<string, number> = {};

  for (const name of ALL_COLLECTIONS) {
    const rows = backup.collections[name];
    if (!Array.isArray(rows)) continue;
    const docs = rows.map((r: any) => {
      const doc: any = { ...sanitize(name, r, false) };
      const _id = typeof r.id === "string" ? toObjectId(r.id) : null;
      if (_id) doc._id = _id;
      doc.created_at = r.created_at ? new Date(r.created_at) : new Date();
      doc.updated_at = r.updated_at ? new Date(r.updated_at) : new Date();
      return doc;
    });
    await db.collection(name).deleteMany({});
    if (docs.length) await db.collection(name).insertMany(docs);
    summary[name] = docs.length;
  }

  if (Array.isArray(backup.files)) {
    const bucket = new GridFSBucket(db, { bucketName: "files" });
    let restored = 0;
    for (const f of backup.files) {
      const _id = toObjectId(String(f.id));
      if (!_id || typeof f.data !== "string") continue;
      if ((await bucket.find({ _id }).limit(1).toArray()).length) continue; // already present
      await new Promise<void>((resolve, reject) => {
        const s = bucket.openUploadStreamWithId(_id, String(f.filename || "file"), { metadata: f.metadata });
        s.on("error", reject).on("finish", () => resolve());
        s.end(Buffer.from(f.data, "base64"));
      });
      restored++;
    }
    summary.files = restored;
  }

  // Make sure first-run seeding never overwrites restored data.
  await db.collection<{ _id: string; at: Date }>("_meta").updateOne(
    { _id: "seeded" }, { $set: { at: new Date() } }, { upsert: true }
  );

  return NextResponse.json({ ok: true, summary });
});
