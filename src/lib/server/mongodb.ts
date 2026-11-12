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

type MetaDoc = { _id: string; at: Date; status?: string };

/**
 * Atomically "claim" a one-time job. insertOne on a fixed _id can only succeed
 * for ONE caller, even when several serverless instances start at the same
 * moment (which is exactly what happens on Vercel). Everyone else gets a
 * duplicate-key error (11000) and skips the job.
 */
async function claim(db: Db, id: string): Promise<boolean> {
  try {
    await db.collection<MetaDoc>("_meta").insertOne({ _id: id, at: new Date(), status: "running" });
    return true;
  } catch (err: any) {
    if (err?.code === 11000) return false;
    throw err;
  }
}

/**
 * First-run seeding: the very first time the app connects to an empty database
 * it copies the bundled content (static-data.ts) in, so the dashboard starts
 * with everything already filled in. It runs only once — after that, the
 * database is the single source of truth and deleting items never brings the
 * defaults back.
 */
async function seedIfEmpty(db: Db) {
  await removeDuplicatesOnce(db);
  if (!(await claim(db, "seeded"))) return;

  try {
    const s = staticData;
    const now = new Date();
    const withDates = <T extends object>(rows: T[]) =>
      rows.map((r) => ({ ...r, created_at: now, updated_at: now }));

    if ((await db.collection("profile").countDocuments()) === 0)
      await db.collection("profile").insertOne({ ...s.profile, updated_at: now });

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
    await db.collection<MetaDoc>("_meta").updateOne({ _id: "seeded" }, { $set: { status: "done" } });
  } catch (err) {
    // Release the claim so the next request can retry seeding.
    await db.collection<MetaDoc>("_meta").deleteOne({ _id: "seeded" }).catch(() => {});
    throw err;
  }
}

/**
 * One-time repair for databases that were seeded several times at once by an
 * earlier version (items showing up 3–5 times in the dashboard). Keeps the
 * oldest copy of each identical item and deletes the rest; keeps only the
 * oldest profile document.
 */
async function removeDuplicatesOnce(db: Db) {
  if (!(await claim(db, "dedupe-v1"))) return;
  try {
    await dedupe(db);
  } catch (err) {
    await db.collection<MetaDoc>("_meta").deleteOne({ _id: "dedupe-v1" }).catch(() => {});
    throw err;
  }
  await db.collection<MetaDoc>("_meta").updateOne({ _id: "dedupe-v1" }, { $set: { status: "done" } });
}

async function dedupe(db: Db) {
  const lists = ["publications", "research_areas", "education", "experience",
    "skills", "awards", "peer_reviews", "certifications"];
  const key = (doc: Record<string, unknown>) => {
    const { _id, created_at, updated_at, ...rest } = doc;
    return JSON.stringify(Object.keys(rest).sort().map((k) => [k, rest[k]]));
  };
  for (const name of lists) {
    const col = db.collection(name);
    const docs = await col.find().sort({ _id: 1 }).toArray();
    const seen = new Set<string>();
    const extra = [];
    for (const d of docs) {
      const k = key(d);
      if (seen.has(k)) extra.push(d._id);
      else seen.add(k);
    }
    if (extra.length) await col.deleteMany({ _id: { $in: extra } });
  }
  const profiles = await db.collection("profile").find({}, { projection: { _id: 1 } }).sort({ _id: 1 }).toArray();
  if (profiles.length > 1)
    await db.collection("profile").deleteMany({ _id: { $in: profiles.slice(1).map((p) => p._id) } });
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
