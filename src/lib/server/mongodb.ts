import { MongoClient, type Db } from "mongodb";
import { staticData } from "../static-data";

/**
 * MongoDB connection (cached across hot reloads and serverless invocations).
 *
 * Env:
 *   MONGODB_URI  e.g. mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
 *   MONGODB_DB   database name (default: "portfolio")
 */

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB?.trim() || "portfolio";

export const isDbConfigured = Boolean(uri);

type Cache = { client: MongoClient | null; promise: Promise<MongoClient> | null; seeded: boolean };
const g = globalThis as unknown as { __mongo?: Cache };
const cache: Cache = g.__mongo ?? (g.__mongo = { client: null, promise: null, seeded: false });

async function connect(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI is not set.");
  if (cache.client) return cache.client;
  if (!cache.promise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      maxPoolSize: 5,
    });
    cache.promise = client.connect().then((c) => {
      cache.client = c;
      return c;
    });
    // If the connection fails, forget the promise so the next request retries.
    cache.promise.catch(() => {
      cache.promise = null;
    });
  }
  return cache.promise;
}

export async function getDb(): Promise<Db> {
  const client = await connect();
  const db = client.db(dbName);
  if (!cache.seeded) {
    await seedIfEmpty(db);
    cache.seeded = true;
  }
  return db;
}

/**
 * First-run seeding: the very first time the app connects to an empty database
 * it copies the bundled content (static-data.ts) in, so the dashboard starts
 * with everything already filled in. A `_meta` marker makes this run only once —
 * after that, the database is the single source of truth and deleting items
 * never brings the defaults back.
 */
async function seedIfEmpty(db: Db) {
  const meta = db.collection<{ _id: string; at: Date }>("_meta");
  if (await meta.findOne({ _id: "seeded" })) return; // already seeded once

  const s = staticData;
  const now = new Date();
  const withDates = <T extends object>(rows: T[]) =>
    rows.map((r) => ({ ...r, created_at: now, updated_at: now }));

  const existingProfile = await db.collection("profile").countDocuments();
  if (!existingProfile) await db.collection("profile").insertOne({ ...s.profile, updated_at: now });

  const lists: [string, object[]][] = [
    ["publications", s.publications],
    ["research_areas", s.researchAreas],
    ["education", s.education],
    ["experience", s.experience],
    ["skills", s.skills],
    ["awards", s.awards],
    ["peer_reviews", s.peerReviews],
    ["certifications", s.certifications],
  ];
  for (const [name, rows] of lists) {
    const col = db.collection(name);
    if ((await col.countDocuments()) === 0 && rows.length) await col.insertMany(withDates(rows));
  }

  await db.collection("messages").createIndex({ created_at: -1 });
  // Mark as seeded only after everything succeeded, so a failed first run retries.
  await meta.updateOne({ _id: "seeded" }, { $set: { at: new Date() } }, { upsert: true });
}

/** Lightweight connectivity check used by /api/health and the dashboard banner. */
export async function pingDb(): Promise<{ ok: boolean; error?: string }> {
  if (!isDbConfigured) return { ok: false, error: "MONGODB_URI is not set." };
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Could not connect to MongoDB." };
  }
}
