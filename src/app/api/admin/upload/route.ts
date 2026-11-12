import { NextResponse } from "next/server";
import { GridFSBucket } from "mongodb";
import { getDb } from "@/lib/server/mongodb";
import { adminRoute, jsonError } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Serverless hosts cap request bodies (~4.5 MB on Vercel, ~6 MB on Netlify).
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = /^(image\/(png|jpe?g|webp|gif)|application\/pdf)$/;

/**
 * POST /api/admin/upload  (multipart form: file, kind=photo|cv)
 * Stores the file inside MongoDB (GridFS) so photos and CVs live in the same
 * database as everything else and are included in backups.
 * Returns { url: "/api/files/<id>" }.
 */
export const POST = adminRoute(async (req) => {
  const form = await req.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") || "file");
  if (!(file instanceof File)) return jsonError("No file uploaded.");
  if (file.size > MAX_BYTES) return jsonError("File is too large (max 4 MB). Please compress it and try again.", 413);
  if (!ALLOWED.test(file.type)) return jsonError("Only PNG, JPG, WEBP, GIF images or PDF files are allowed.", 415);

  const db = await getDb();
  const bucket = new GridFSBucket(db, { bucketName: "files" });
  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || `${kind}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const id = await new Promise<string>((resolve, reject) => {
    const stream = bucket.openUploadStream(safeName, {
      metadata: { kind, contentType: file.type, uploadedAt: new Date() },
    });
    stream.on("error", reject);
    stream.on("finish", () => resolve(String(stream.id)));
    stream.end(buf);
  });

  return NextResponse.json({ url: `/api/files/${id}`, id });
});
