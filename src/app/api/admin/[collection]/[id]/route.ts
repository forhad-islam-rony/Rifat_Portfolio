import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/mongodb";
import { adminRoute, jsonError } from "@/lib/server/session";
import { SCHEMAS, sanitize, serialize, toObjectId } from "@/lib/server/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: { collection: string; id: string } };

function resolve(params: Ctx["params"]) {
  if (!(params.collection in SCHEMAS) || params.collection === "profile") return null;
  const _id = toObjectId(params.id);
  return _id ? { collection: params.collection, _id } : null;
}

/** PATCH /api/admin/:collection/:id — update fields */
export const PATCH = adminRoute<Ctx>(async (req, { params }) => {
  const r = resolve(params);
  if (!r) return jsonError("Not found.", 404);
  const update = { ...sanitize(r.collection, await req.json(), true), updated_at: new Date() };
  const db = await getDb();
  const saved = await db
    .collection(r.collection)
    .findOneAndUpdate({ _id: r._id }, { $set: update }, { returnDocument: "after" });
  if (!saved) return jsonError("Not found.", 404);
  return NextResponse.json({ item: serialize(saved) });
});

/** DELETE /api/admin/:collection/:id */
export const DELETE = adminRoute<Ctx>(async (_req, { params }) => {
  const r = resolve(params);
  if (!r) return jsonError("Not found.", 404);
  const db = await getDb();
  await db.collection(r.collection).deleteOne({ _id: r._id });
  return NextResponse.json({ ok: true });
});
