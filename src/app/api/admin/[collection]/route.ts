import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/mongodb";
import { adminRoute, jsonError } from "@/lib/server/session";
import { SCHEMAS, sanitize, serialize, serializeAll } from "@/lib/server/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: { collection: string } };

const editable = (c: string) => c in SCHEMAS && c !== "profile";

/** GET /api/admin/:collection — list all items */
export const GET = adminRoute<Ctx>(async (_req, { params }) => {
  const { collection } = params;
  if (!editable(collection)) return jsonError("Unknown collection.", 404);
  const sort: Record<string, 1 | -1> =
    collection === "messages" ? { created_at: -1 } : { sort_order: 1, _id: 1 };
  const db = await getDb();
  const docs = await db.collection(collection).find().sort(sort).toArray();
  return NextResponse.json({ items: serializeAll(docs) });
});

/** POST /api/admin/:collection — create an item */
export const POST = adminRoute<Ctx>(async (req, { params }) => {
  const { collection } = params;
  if (!editable(collection) || collection === "messages") return jsonError("Unknown collection.", 404);
  const doc = { ...sanitize(collection, await req.json(), false), created_at: new Date(), updated_at: new Date() };
  const db = await getDb();
  const { insertedId } = await db.collection(collection).insertOne(doc);
  const saved = await db.collection(collection).findOne({ _id: insertedId });
  return NextResponse.json({ item: serialize(saved) }, { status: 201 });
});
