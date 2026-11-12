import { GridFSBucket } from "mongodb";
import { getDb } from "@/lib/server/mongodb";
import { adminRoute } from "@/lib/server/session";
import { ALL_COLLECTIONS, serializeAll } from "@/lib/server/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/backup — downloads EVERYTHING (all content, messages and
 * uploaded files as base64) as one JSON file. Keep a copy on your computer /
 * Google Drive; it can be restored from the dashboard at any time.
 */
export const GET = adminRoute(async () => {
  const db = await getDb();
  const collections: Record<string, unknown[]> = {};
  for (const name of ALL_COLLECTIONS) {
    collections[name] = serializeAll(await db.collection(name).find().toArray());
  }

  const bucket = new GridFSBucket(db, { bucketName: "files" });
  const files: { id: string; filename: string; metadata: unknown; data: string }[] = [];
  for (const f of await bucket.find().toArray()) {
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) =>
      bucket.openDownloadStream(f._id).on("data", (c: Buffer) => chunks.push(c)).on("error", reject).on("end", () => resolve())
    );
    files.push({ id: String(f._id), filename: f.filename, metadata: f.metadata, data: Buffer.concat(chunks).toString("base64") });
  }

  const backup = { app: "rifat-portfolio", version: 1, exported_at: new Date().toISOString(), collections, files };
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="portfolio-backup-${stamp}.json"`,
    },
  });
});
