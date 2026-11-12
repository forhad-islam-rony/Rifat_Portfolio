import { GridFSBucket } from "mongodb";
import { getDb, isDbConfigured } from "@/lib/server/mongodb";
import { toObjectId } from "@/lib/server/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/files/:id — public download of an uploaded photo / CV from GridFS. */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const _id = toObjectId(params.id);
  if (!_id || !isDbConfigured) return new Response("Not found", { status: 404 });
  try {
    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: "files" });
    const [info] = await bucket.find({ _id }).limit(1).toArray();
    if (!info) return new Response("Not found", { status: 404 });

    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      bucket
        .openDownloadStream(_id)
        .on("data", (c: Buffer) => chunks.push(c))
        .on("error", reject)
        .on("end", () => resolve());
    });

    const type = (info.metadata as any)?.contentType || "application/octet-stream";
    return new Response(Buffer.concat(chunks), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(info.length),
        "Content-Disposition": `inline; filename="${info.filename}"`,
        // Files are immutable (a new upload gets a new id), so cache aggressively.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("File temporarily unavailable", { status: 503 });
  }
}
